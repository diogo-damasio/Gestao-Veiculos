import * as path from "path";
import Datastore from "nedb";

/**
 * Interface que define os objetos do tipo IUser
 * ID: número de identificação do utilizador
 * Name: nome do utilizador
 * Password: palavra-passe
 */
export interface IUser {
    _id?: string;
    name: string;
    password: string;
}

//Objeto que contem os dados do utilizador ativo
export let currentUser: IUser; 

/**
 * Classe que implementa um objeto Worker
 * Este objeto tem a função de manipular objetos do tipo IUser numa base de dados
 * 
 * @param db Base de dados do tipo Nedb
 */
export class Worker {
    private db: Nedb;
    
    /**
     * Construtor de Worker
     */
    constructor() {

        //Inicializa a base de dados
        this.db = new Datastore({

            //Nome do ficheiro de base de dados         
            filename: path.join(__dirname, "users.db"),
            
            //Carregamento automático da base de dados
            autoload: true
        });
    }


    /**
     * Lista todos os utilizadores da base de dados
     * @returns Promise que, se resolvida, contém uma lista de utilizadores
     */
    public listUsers(): Promise<IUser[]> {

        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {

            //Procura na base de dados todos os utilizadores
            this.db.find({}, (error: Error | null, docs: IUser[]) => {

                //Não existem, rejeita a promise
                if (error) {
                    reject(error);
                } 
                
                //Existem, resolve a promise e retorna a lista de utilizadores
                else {
                    resolve(docs);
                }
            });
        });
    }


    /**
     * Adiciona um utilzador à base de dados (regista-o no sistema)
     * @param user Objeto do tipo IUser a ser adicionado
     * @returns Promise que, se resolvida, contém um objeto IUser
     */
    public addUser(user: IUser): Promise<IUser> {
        
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {

            //Insere na base de dados o utilizador especificado
            this.db.insert(user, (error: Error | null, newDoc: IUser) => {

                //Erro, rejeita a promise
                if (error) {
                    reject(error);
                } 
                
                //Sucesso, resolve a promise e retorna o utilizador
                else {
                    resolve(newDoc);
                }
            });
        });
    }




    /**
     * Elimina um utilizador da base de dados com base no seu ID. Elimina também todos os seus veículos
     * @param id ID do utilizador a eliminar
     * @returns Promise
     */
    public deleteUser(id: string): Promise<void> {

        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            try {
                // Criar instância da base de dados dos veículos
                const vehiclesDb = new Datastore({
                    filename: path.join(__dirname, "vehicles.db"),
                    autoload: true,
                });
    
                // Remover todos os veículos associados ao utilizador
                vehiclesDb.remove({ ownerId: id }, { multi: true }, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        // Após remover os veículos, remover o utilizador
                        this.db.remove({ _id: id }, {}, (error: Error | null) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * Altera a palavra-passe do utilizador atualmente autenticado (currentUser)
     * @param newPassword Nova palavra-passe
     * @returns Promise que, se resolvida, confirma a atualização
     */
    public changePassword(newPassword: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
    
            // Atualiza a palavra-passe do utilizador autenticado na base de dados
            this.db.update({ _id: currentUser._id }, { $set: { password: newPassword } }, {}, (error, numUpdated) => {
                    
                //Se ocorrer um erro a promise não é resolvida
                if (error) {
                    reject(error);
                } else if (numUpdated === 0) {
                    reject(new Error("Falha ao atualizar a palavra-passe."));
                } 
                    
                else {
                    // Atualiza o objeto currentUser localmente
                    currentUser.password = newPassword;
                    resolve(currentUser);
                }
    
                this.db.loadDatabase();
            });
        });
    }    
    

    /**
     * Realiza o login
     * @param name Nome do utilizador
     * @param password Palavra-passe do utilizador
     * @returns Promise que, se resolvida, contém um objeto IUser
     */
    public login(name: string, password: string): Promise<IUser | null> {   
        
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {

            //Procura na base de dados um utilizador com as credenciais especificadas
            this.db.findOne({ name, password }, (error: Error | null, doc: IUser | null) => {
                
                //Erro, rejeita a promise
                if (error) {
                    reject(error);
                } 
                
                //Sucesso, resolve a promise
                else {

                    //Associa o utilizador encontrado ao objeto currentUser e retorna o utilizador
                    if(doc) currentUser = doc;
                    resolve(doc);
                }
            });
        });
    }


    
}