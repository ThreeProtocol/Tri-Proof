import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SYSVAR_RENT_PUBKEY, MAX_SEED_LENGTH , SignatureStatus } from '@solana/web3.js';
import { use } from "chai";
import { GigHubCoinTest } from "../target/types/gig_hub_coin_test";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID, NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAccount, createInitializeMintInstruction,
  createMint, getOrCreateAssociatedTokenAccount,
  mintTo, createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  transfer
} from "@solana/spl-token";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";



const con = new Connection("https://api.devnet.solana.com");
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.GigHubCoinTest as Program<GigHubCoinTest>;
let recieverPrivKey = [110, 165, 169, 231, 188, 200, 1, 220, 114, 253, 204, 107, 7, 182, 228, 36, 183, 193, 216, 47, 42, 85, 158, 87, 234, 12, 197, 161, 140, 80, 73, 212, 66, 150, 139, 35, 195, 192, 70, 29, 106, 98, 129, 227, 100, 190, 217, 218, 138, 55, 200, 37, 108, 10, 2, 120, 237, 102, 176, 29, 176, 20, 45, 220].slice(0, 32);
let reciever_wallet = anchor.web3.Keypair.fromSeed(Uint8Array.from(recieverPrivKey));
let accountPrivKey = [110,64,28,221,77,73,226,227,69,150,32,3,49,180,26,252,225,89,126,147,100,10,250,174,113,64,224,244,97,113,221,188,120,98,241,96,223,149,212,240,31,160,209,216,169,36,225,107,133,146,247,55,29,86,173,27,176,211,230,223,2,35,115,255].slice(0, 32);
let User_Wallet = anchor.web3.Keypair.fromSeed(Uint8Array.from(accountPrivKey));


describe("anchorFirst", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());


  it("Is initialized!", async () => {
    // Add your test here.
    let transaction = new anchor.web3.Transaction();
    let mintA = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
    let assign_ata = new anchor.web3.PublicKey("DJAWin1NF25gaFFStbmY9WfkKarRbrWAE2CyTtkYqawD");
    let fee_account = new anchor.web3.PublicKey("5Uw3sWy6oRu5Nt7jqcUVLqMzaQd9MdrpCfyXFYzCcA5h");
    let admin_account = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
    let programIDTest = new anchor.web3.PublicKey("GH1vm3L2rob7GzLLQCi5t9shgJDXSWCTA8zgJjhGNKXx");
    let walletana = new anchor.web3.PublicKey("93ux4AyCQGjBPfEX2heytWq6Xy55KVPCEiDN8HF8msAb");
    let myToken_acctA = await getOrCreateAssociatedTokenAccount(con,
      User_Wallet,
      mintA,
      User_Wallet.publicKey);

    let amount =0.2 * LAMPORTS_PER_SOL;
    let amount_usdc = 10;
    let counterMain = 6;


    //init counter
    // const [counterpda, _] = await anchor.web3.PublicKey.findProgramAddressSync([
    //   Buffer.from("counter")
    // ], program.programId); // -> x45asd43zx5d4sa21d5asd4

    // if (await con.getAccountInfo(counterpda) == null) {
    //   let transactionforCounter = new anchor.web3.Transaction();
    //   transactionforCounter.add(await program.methods.initcounter().accounts({
    //     counterPda: counterpda
    //   }).signers([User_Wallet]).instruction())

    //   await sendAndConfirmTransaction(con, transactionforCounter, [User_Wallet])
    //   console.log("counter deployed: ", counterpda);
    //  counterMain = (await program.account.counter.fetch(counterpda)).count;
    //  console.log("newCounterValue: ", counterMain);
    //  console.log("counterpda: ", counterpda);
    // } else {
    //   console.log("Counter found count is: ", (await program.account.counter.fetch(counterpda)).count);
    // counterMain = (await program.account.counter.fetch(counterpda)).count;
    //   console.log("newCounterValue: ", counterMain);
    //   console.log("counterpda: ", counterpda);
    // }



    // state PDA for token

    const total_count: number = counterMain + 1;
    const [user_pda_state, bump_state] = findProgramAddressSync(
      [walletana.toBuffer(), Uint8Array.from([28]), walletana.toBuffer(), Buffer.from("state")],
      programIDTest
    );
    //console.log(user_pda_state);
    //console.log("PDA account info: ", (await program.account.state.fetch(user_pda_state)));
  
    // const getConfirmation = async () => {
    //   const result = await con.getSignatureStatus("PzS4DYcdDUZ96gFStna27syLcAkR6drPaf1cHEdTLWbHBXfKKqvKQxTYARikzbT7LkX9k8HdG7j9phhuXi4gB6G", {
    //     searchTransactionHistory: true,
    //   });
    //   return result.value;
    // }
    // console.log("Confirm: ",getConfirmation);

    const status = await con.("4fwgX16WDwYj5hZ2t5xEHz6UUnuaTovJpMeoWWEBvuA7z1baf1qX1BW2EGZVR9ChSyJZ8akeLX6EDTadFcEcSTdy",
      {
        searchTransactionHistory: true,
      }
    );
    console.log(status);
      
   // 8LNAUJ5qFxpsTvXYmcBrGi9A5JmfkaaPUQSEJGYSvDke
    // if (await con.getAccountInfo(user_pda_state) == null) {
    //   let transaction10 = new anchor.web3.Transaction();
    //   transaction10.add(await program.methods.initializestatepda(bump_state, new anchor.BN(amount_usdc), reciever_wallet.publicKey, true
    //   )
    //     .accounts({
    //       statepda: user_pda_state,
    //       owner: User_Wallet.publicKey,
    //       //depositTokenAccount: myToken_acctA.address,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       counterPda: counterpda
    //     }).signers([User_Wallet])
    //     .instruction())
    //     try{
    //       let tx1 = await sendAndConfirmTransaction(con, transaction10, [User_Wallet]);
    //       console.log("PDA deployed: ", tx1);
    //     }catch(_err){
    //       console.log(_err);
          
    //     }

    // } else {
    //   console.log("Account already inited: ", user_pda_state.toString());
    //   console.log("PDA account info: ", (await program.account.state.fetch(user_pda_state)));
    // }







    // let transaction1 = new anchor.web3.Transaction();

    // //PDA init to ATA
    // const [usertokenpda, bump_token] = await anchor.web3.PublicKey.findProgramAddress(
    //   [User_Wallet.publicKey.toBuffer(), Uint8Array.from([counterMain]), User_Wallet.publicKey.toBuffer()],
    //   program.programId
    // );

    // const [user_pda_state, bump_state] = await anchor.web3.PublicKey.findProgramAddress(
    //   [User_Wallet.publicKey.toBuffer(), Uint8Array.from([counterMain]), User_Wallet.publicKey.toBuffer(), Buffer.from("state")],
    //   program.programId
    // );

    // if (await con.getAccountInfo(usertokenpda) == null) {

    //   transaction1.add(await program.methods.initialisetokenpda(bump_token,
    //   )
    //     .accounts({
    //       tokenpda: usertokenpda,
    //       statepda: user_pda_state,
    //       mint: mintA,
    //       owner: User_Wallet.publicKey,
    //       depositTokenAccount: myToken_acctA.address,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       rent: SYSVAR_RENT_PUBKEY,
    //       tokenProgram: TOKEN_PROGRAM_ID
    //     }).signers([User_Wallet])
    //     .instruction())
    //   let tx2 = await sendAndConfirmTransaction(con, transaction1, [User_Wallet]);
    //   console.log("PDA to ATA confirmed: ", tx2);
    // } else {
    //   console.log("PDA ATA already init: ", usertokenpda.toString());
    // }




    // let transfasd = new anchor.web3.Transaction().add()
    // transfasd.


    // let transaction2 = new anchor.web3.Transaction();
    // let wallet_to_deposit_to = await getOrCreateAssociatedTokenAccount(
    //   con,
    //   reciever_wallet,
    //   mintA,
    //   reciever_wallet.publicKey,
    // );
    // //Transfer ATA To PDA (USDC)
    // console.log("Account current Status: 1", (await program.account.state.fetch(user_pda_state)));
    // transaction2.add(await program.methods.sendusdctopda(bump_state, bump_token,
    // )
    //   .accounts({
    //     tokenpda: usertokenpda,
    //     statepda: user_pda_state,
    //     mint: mintA,
    //     feeAccount:wallet_to_deposit_to.address,
    //     owner: reciever_wallet.publicKey,
    //     depositTokenAccount: wallet_to_deposit_to.address,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     rent: SYSVAR_RENT_PUBKEY,
        
    //     tokenProgram: TOKEN_PROGRAM_ID
    //   }).signers([reciever_wallet])
    //   .instruction())

    //   try{
    //     let tx3 = await sendAndConfirmTransaction(con, transaction2, [reciever_wallet]);
    //     console.log("Token succesfully send to PDA: ", tx3);
    //     console.log("Account current Status: 2", (await program.account.state.fetch(user_pda_state)));
        
    //   }catch(err){
    //     console.log(err);
        
    //   }



    // //send PDA TO ATA (USDC)
    // let wallet_to_deposit_to = await getOrCreateAssociatedTokenAccount(
    //   con,
    //   reciever_wallet,
    //   myToken_acctA.mint,
    //   reciever_wallet.publicKey,
    // );
    // console.log("Account current Status: 1", (await program.account.state.fetch(user_pda_state)));
    // let transaction5 = new anchor.web3.Transaction();
    // transaction5.add(await program.methods.sendusdctoreciever(bump_state, bump_token,
    //   )
    //   .accounts({
    //     tokenpda: usertokenpda,
    //     statepda: user_pda_state,
    //     walletToDepositTo: wallet_to_deposit_to.address,
    //     //depositTokenAccount: myToken_acctA.address,
    //     reciever: User_Wallet.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     tokenProgram: TOKEN_PROGRAM_ID
    //   }).signers([User_Wallet])
    //   .instruction())
    //   try{
    //     const tx5 = await sendAndConfirmTransaction(con, transaction5, [User_Wallet]);

    //     console.log("Transfer Success from PDA to wallet: ", tx5);
    //     console.log("Account current Status: 2", (await program.account.state.fetch(user_pda_state)));
    //   }catch(err){
    //     console.log("Error: ", err);
        
    //   }


    //Send sol to PDA
    //     const [user_pda_state, bump_state] = await anchor.web3.PublicKey.findProgramAddress(
    //   [User_Wallet.publicKey.toBuffer(), Uint8Array.from([counterMain]), User_Wallet.publicKey.toBuffer(), Buffer.from("state")],
    //   program.programId
    // );
    //console.log("Account current Status: ", (await program.account.state.fetch(user_pda_state)));

    //Update Status
    // let transacion7 = new anchor.web3.Transaction();
    // transacion7.add(await program.methods.updateStatus(
    //   false,
    //   admin_account,
    //   0
    // ).accounts({
    //   statepda:user_pda_state,
    //   owner: reciever_wallet.publicKey,
    //   systemProgram: anchor.web3.SystemProgram.programId
    // }).signers([reciever_wallet]).instruction())

    // try{
    //   const tx7 = await sendAndConfirmTransaction(con, transacion7, [reciever_wallet]);
    //   console.log("Transaction succeed: ", tx7);
    //   console.log("Account current Status: 2", (await program.account.state.fetch(user_pda_state)));
      
    // }catch(err){
    //   console.log("Erro accourd: ", err);
      
    // }

    //send sol pda to reciever

    // let transaction8 = new anchor.web3.Transaction();

    // transaction8.add(await program.methods.sendsoltoreciever(bump_state).accounts({
    //   statepda: user_pda_state,
    //   owner:User_Wallet.publicKey,
    //   systemProgram: anchor.web3.SystemProgram.programId
    // }).signers([User_Wallet]).instruction());

    // try{
    //   const tx8 = await sendAndConfirmTransaction(con, transaction8, [User_Wallet])
    //   console.log("Transaction succeed: ", tx8);
    //   console.log("Account current Status: ", (await program.account.state.fetch(user_pda_state)));
    // }catch(err){
    //   console.log("Error : ",err);
      
    // }

    //Send sol to PDA 
    // let transaction6 = new anchor.web3.Transaction();
    //   console.log(user_pda_state.toString());
      
    // transaction6.add(await program.methods.sendsoltopda()
    //   .accounts({
    //     owner: reciever_wallet.publicKey,
    //     statepda: user_pda_state,
    //     feeAccountPubkey: reciever_wallet.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId
    //   }).signers([reciever_wallet]).instruction())
    //   try{
        
    //     const tx6 = await sendAndConfirmTransaction(con, transaction6, [reciever_wallet]);
    //     console.log("Send to PDA (sol) worked: ", tx6);
    //     console.log("Account current Status: ", (await program.account.state.fetch(user_pda_state)));
    //    // throw new Error('anchorError occurred');
    //   }catch(_err){
    //     console.log("Error: ", _err);
    //   }
    
  });





});
