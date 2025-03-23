"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = exports.currentUser = void 0;
const path = __importStar(require("path"));
const nedb_1 = __importDefault(require("nedb"));
/**
 * Classe que implementa um objeto Worker
 * Este objeto tem a função de manipular objetos do tipo IUser numa base de dados
 *
 * @param db Base de dados do tipo Nedb
 */
class Worker {
    /**
     * Construtor de Worker
     */
    constructor() {
        //Inicializa a base de dados
        this.db = new nedb_1.default({
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
    listUsers() {
        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {
            //Procura na base de dados todos os utilizadores
            this.db.find({}, (error, docs) => {
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
    addUser(user) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            //Insere na base de dados o utilizador especificado
            this.db.insert(user, (error, newDoc) => {
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
    deleteUser(id) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            try {
                // Criar instância da base de dados dos veículos
                const vehiclesDb = new nedb_1.default({
                    filename: path.join(__dirname, "vehicles.db"),
                    autoload: true,
                });
                // Remover todos os veículos associados ao utilizador
                vehiclesDb.remove({ ownerId: id }, { multi: true }, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        // Após remover os veículos, remover o utilizador
                        this.db.remove({ _id: id }, {}, (error) => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Altera a palavra-passe do utilizador atualmente autenticado (currentUser)
     * @param newPassword Nova palavra-passe
     * @returns Promise que, se resolvida, confirma a atualização
     */
    changePassword(newPassword) {
        return new Promise((resolve, reject) => {
            // Atualiza a palavra-passe do utilizador autenticado na base de dados
            this.db.update({ _id: exports.currentUser._id }, { $set: { password: newPassword } }, {}, (error, numUpdated) => {
                //Se ocorrer um erro a promise não é resolvida
                if (error) {
                    reject(error);
                }
                else if (numUpdated === 0) {
                    reject(new Error("Falha ao atualizar a palavra-passe."));
                }
                else {
                    // Atualiza o objeto currentUser localmente
                    exports.currentUser.password = newPassword;
                    resolve(exports.currentUser);
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
    login(name, password) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            //Procura na base de dados um utilizador com as credenciais especificadas
            this.db.findOne({ name, password }, (error, doc) => {
                //Erro, rejeita a promise
                if (error) {
                    reject(error);
                }
                //Sucesso, resolve a promise
                else {
                    //Associa o utilizador encontrado ao objeto currentUser e retorna o utilizador
                    if (doc)
                        exports.currentUser = doc;
                    resolve(doc);
                }
            });
        });
    }
}
exports.Worker = Worker;
