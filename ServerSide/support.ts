import * as path from "path";
import Datastore from "nedb";

/**
 * Interface que define os objetos do tipo ISupport
 * ID: número de identificação do utilizador
 * Message: mensagem de suporte
 */
export interface ISupport {
    _id?: string;
    message: string;
}

//Objeto que contem os dados do utilizador ativo
export let currentSupport: ISupport; 

/**
 * Classe que implementa um objeto Worker
 * Este objeto tem a função de manipular objetos do tipo ISupport numa base de dados
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
            filename: path.join(__dirname, "support.db"),
            
            //Carregamento automático da base de dados
            autoload: true
        });
    }


    /**
     * Lista todas as mensagens de suporte da base de dados
     * @returns Promise que, se resolvida, contém uma lista de mensagens de suporte
     */
    public listMessages(): Promise<ISupport[]> {

        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {

            //Procura na base de dados as mensagens dos utilizadores
            this.db.find({}, (error: Error | null, docs: ISupport[]) => {

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
     * Adiciona uma mensagem de suporte à base de dados (regista-o no sistema)
     * @param support Objeto do tipo ISupport a ser adicionado
     * @returns Promise que, se resolvida, contém um objeto ISupport
     */
    public addMessage(support: ISupport): Promise<ISupport> {
        
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {

            //Insere na base de dados a mensagem especificado
            this.db.insert(support, (error: Error | null, newDoc: ISupport) => {

                //Erro, rejeita a promise
                if (error) {
                    reject(error);
                } 
                
                //Sucesso, resolve a promise e retorna a mensagem adicionada
                else {
                    resolve(newDoc);
                }
            });
        });
    }

    /**
     * Elimina uma mensagem de suporte da base de dados com base no seu ID.
     * @param id ID da mensagem
     * @returns Promise
     */
    public deleteMessage(id: string): Promise<void> {

        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            try {
                // Criar instância da base de dados das mensagens
                const messagesDb = new Datastore({
                    filename: path.join(__dirname, "support.db"),
                    autoload: true,
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
