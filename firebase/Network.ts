// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';
import { firebaseConfig } from './firebase.config.js'
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/firestore';
import { Schemas } from './Schemas'
import { getNewAccount } from '../src/util/Util';
import { onJoinEncounter, onLoginStarted, onLoginUser, onLogoutUser, onEncounterUpdated } from '../src/uiManager/Thunks';

firebase.initializeApp(firebaseConfig);

class Provider {
    db: firebase.firestore.Firestore
    auth: firebase.auth.Auth
    unsub: Function

    constructor(){
        this.db = firebase.firestore()
        this.auth = firebase.auth()
        this.auth.onIdTokenChanged(async (user) => {
            onLoginStarted()
            if (user) {
                let userAccount = getNewAccount(user.email, user.uid)
                let ref = await this.db.collection(Schemas.Collections.Accounts.collectionName).doc(user.email).get()
                if(ref.exists){
                    userAccount = ref.data() as UserAccount
                    if(userAccount.encounterId){
                        let encRef = await this.db.collection(Schemas.Collections.Encounters.collectionName).doc(userAccount.encounterId).get()
                        if(encRef.exists){
                            const encounter = encRef.data() as Encounter
                            onJoinEncounter(encounter, userAccount)
                            return
                        }
                    }
                }
                onLoginUser(userAccount)
            } else {
                onLogoutUser()
            }
        });
    }
    logoutUser = () => {
        this.auth.signOut()
    }
    onTrySignIn = async (email:string, password:string) => {
        await this.auth.signInWithEmailAndPassword(email, password)
    }
    onCreateUser = async (email:string, password:string) => {
        await this.auth.createUserWithEmailAndPassword(email, password)
    }
    onEditHandle = async (player:UserAccount, handle:string) => {
        this.auth.currentUser.updateProfile({displayName: handle})
        // onUpdatePlayerName(handle)
    }
    sendVerification = () => {
        this.auth.currentUser.sendEmailVerification()
    }
    createMatch = async (name:string, player:Account) => {
        // let existing = await this.db.collection(Schemas.Collections.Matches.collectionName).get()
        // existing.docs
        //     .map(m=>m.data() as Encounter)
        //     .filter(m=>m.characters.find(p=>p.uid === player.uid) || m.characters.every(p=>p.isAi))
        //     .forEach(m=>this.db.collection(Schemas.Collections.Matches.collectionName).doc(m.id).delete())

        // let match = getNewMatchObject(name, player)
        // await this.upsertMatch(match)
        // onMatchJoin(match)
        // this.subscribeToMatch(match.id)
        // return match
    }

    joinMatch = async (matchId:string, player:Account) => {
        let ref = await this.db.collection(Schemas.Collections.Encounters.collectionName).doc(matchId).get()
        if(ref.exists){
            // let match = ref.data() as Encounter
            // match.characters.push(player)
            // onMatchJoin(match)
            // await this.upsertMatch(match)
            // this.subscribeToMatch(match.id)
        }
    }

    deleteMatch = async (matchId:string) => {
        await this.db.collection(Schemas.Collections.Encounters.collectionName).doc(matchId).delete()
    }

    subscribeToEncounter = (id:string) => {
        if(this.unsub) console.warn('uhh, already subscribed to an encounter??')
        this.unsub = this.db.collection(Schemas.Collections.Encounters.collectionName).doc(id)
        .onSnapshot(
            (snap) => {
                let match = snap.data() as Encounter
                onEncounterUpdated(match)
            }
        )
    }

    unsubscribeMatch = (match:Encounter, playerId:string) => {
        if(this.unsub){
            this.unsub()
            this.unsub = null
            match.playerCharacters = match.playerCharacters.filter(p=>p.id !== playerId)
            if(match.playerCharacters.filter(c=>c.ownerId).length > 0) this.upsertMatch(match)
            else this.deleteMatch(match.id)
        }
    }

    upsertMatch = async (match:Encounter) => {
        await this.db.collection(Schemas.Collections.Encounters.collectionName).doc(match.id).set(match)
    }

    upsertAccount = (account:UserAccount) => {
        this.db.collection(Schemas.Collections.Accounts.collectionName).doc(account.email).set(account)
    }

    doSignInWithEmailAndPassword = (email:string, password:string) => this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()
  
    //sendPasswordReset = (email:string) => this.auth.sendPasswordResetEmail(email, { url: baseApiUrl+ROUTES.RESET_PASSWORD})
  
    confirmPasswordReset = (token:string, newPassword:string) => this.auth.confirmPasswordReset(token, newPassword)

    verifyPasswordToken = (token:string) => this.auth.verifyPasswordResetCode(token)

    doSendEmailVerification = () => {
        this.auth.currentUser && this.auth.currentUser.sendEmailVerification()
    }

    verifyEmail = async (token:string) => this.auth.applyActionCode(token)

    doPasswordUpdate = (password:string) => this.auth.currentUser && this.auth.currentUser.updatePassword(password)
}

let Network = new Provider()

export default Network