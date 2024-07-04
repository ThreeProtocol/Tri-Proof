use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{ self, Mint, Token, TokenAccount, Transfer as SplTransfer }
};
use std::mem::size_of;

use crate::state::contract::*;
use crate::constants::{
    CONTRACT_SEED,
    PAY_TOKEN_MINT_ADDRESS,
    DECIMAL
};
use crate::errors::{
    GigContractError
};


pub fn start_contract(
    ctx: Context<StartContractContext>,
    contract_id: String,
    amount: u64, 
    dispute: u64, // $0.5 for now
    deadline: u32,
) -> Result<()> {
    msg!("Creating a new contract with the following Id: {}", contract_id);

    require_keys_eq!(ctx.accounts.pay_token_mint.key(), PAY_TOKEN_MINT_ADDRESS, GigContractError::PayTokenMintError);

    // Check if the contract is pending which means one of two parties approved.
    // powi(10.0, 6) for USDC, powi(10.0, 8) for BPT for test
    require!(dispute == (0.5 * f64::powi(10.0, 8)).round() as u64 , GigContractError::InvalidDisputeAmount);
    
    let contract = &mut ctx.accounts.contract;
    let current_timestamp = Clock::get()?.unix_timestamp as u32;
    let token_program = &ctx.accounts.token_program;
    let authority = &ctx.accounts.buyer;
    let source = &ctx.accounts.buyer_ata;
    let destination = &ctx.accounts.contract_ata;
    
    contract.contract_id = contract_id;
    contract.buyer = ctx.accounts.buyer.key();
    contract.seller = ctx.accounts.seller.key();
    contract.start_time = current_timestamp;
    contract.amount = amount;
    contract.dispute = dispute;
    contract.deadline = deadline;
    contract.status = ContractStatus::Created;

    // Transfer paytoken(amount + dispute) to the contract account
    token::transfer(
    CpiContext::new(
        token_program.to_account_info(),
        SplTransfer {
            from: source.to_account_info().clone(),
            to: destination.to_account_info().clone(),
            authority: authority.to_account_info().clone(),
        },
    ),
    (amount + dispute).try_into().unwrap(),
    )?;
  
    msg!("New contract created successfully!");
    Ok(())
}

#[derive(Accounts)]
#[instruction(contract_id: String)]
pub struct StartContractContext<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        init, 
        seeds = [
            CONTRACT_SEED.as_bytes(), 
            &contract_id.as_bytes()
        ], 
        payer = buyer, 
        bump, 
        space = size_of::<Contract>() + 8,
    )]
    pub contract: Account<'info, Contract>,

    pub seller: SystemAccount<'info>,

    pub pay_token_mint: Account<'info, Mint>,
    
    #[account(
        mut, 
        associated_token::mint = pay_token_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_ata: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = pay_token_mint,
        associated_token::authority = contract,
    )]
    pub contract_ata: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>
}
