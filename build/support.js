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
exports.Worker = exports.currentSupport = void 0;
const path = __importStar(require("path"));
const nedb_1 = __importDefault(require("nedb"));
/**
 * Classe que implementa um objeto Worker
 * Este objeto tem a função de manipular objetos do tipo ISupport numa base de dados
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
            filename: path.join(__dirname, "support.db"),
            //Carregamento automático da base de dados
            autoload: true
        });
    }
    /**
     * Lista todas as mensagens de suporte da base de dados
     * @returns Promise que, se resolvida, contém uma lista de mensagens de suporte
     */
    listMessages() {
        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {
            //Procura na base de dados as mensagens dos utilizadores
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
     * Adiciona uma mensagem de suporte à base de dados (regista-o no sistema)
     * @param support Objeto do tipo ISupport a ser adicionado
     * @returns Promise que, se resolvida, contém um objeto ISupport
     */
    addMessage(support) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            //Insere na base de dados a mensagem especificado
            this.db.insert(support, (error, newDoc) => {
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
    deleteMessage(id) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            try {
                // Criar instância da base de dados das mensagens
                const messagesDb = new nedb_1.default({
                    filename: path.join(__dirname, "support.db"),
                    autoload: true,
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.Worker = Worker;
