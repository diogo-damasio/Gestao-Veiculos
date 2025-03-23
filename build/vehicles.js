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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const path = __importStar(require("path"));
const Datastore = require("nedb");
class Worker {
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "vehicles.db"),
            autoload: true
        });
    }
    listVehicles(ownerId) {
        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {
            //Procura na base de dados os veículos com ownerID igual ao especificado
            this.db.find({ ownerId }, (error, docs) => {
                //Não existem, rejeita a promise
                if (error) {
                    reject(error);
                }
                //Existem, resolve a promise e retorna a lista de veículos
                else {
                    resolve(docs);
                }
            });
        });
    }
    /**
     * Adiciona um veículo à base de dados
     * @param vehicle Objeto do tipo IVehicle a ser adicionado
     * @returns Promise que, se resolvida, contém um objeto IVehicle
     */
    addVehicle(vehicle) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            //Insere na base de dados o veículo especificado
            this.db.insert(vehicle, (error, newDoc) => {
                //Erro, rejeita a promise
                if (error) {
                    reject(error);
                }
                //Sucesso, resolve a promise e retorna o veículo
                else {
                    resolve(newDoc);
                }
            });
        });
    }
    /**
     * Elimina um veículo da base de dados com base no seu ID
     * @param id ID do veículo a eliminar
     * @returns Promise
     */
    deleteVehicle(id) {
        //Criação e retorno da promise
        return new Promise((resolve, reject) => {
            //Remove o veiculo com o ID especificado da base de dados
            this.db.remove({ _id: id }, {}, (error, numRemoved) => {
                //Se não existe esse veículo ou se ocorreu erro, rejeita a promise
                if (error) {
                    reject(error);
                }
                //Sucesso, resolve a promise
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Lista veículos favoritos de um determinado proprietário
     * @param ownerId ID do proprietário
     * @returns Promise que, se resolvida, contém uma lista de veículos
     */
    listFavorites(ownerId) {
        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {
            //Procura na base de dados os veículos favoritos com ownerID igual ao especificado
            this.db.find({ ownerId, isFavorite: true }, (error, docs) => {
                //Não existem, rejeita a promise
                if (error) {
                    reject(error);
                }
                //Existem, resolve a promise e retorna a lista de veículos
                else {
                    resolve(docs);
                }
            });
        });
    }
    /**
     * Marca um veículo como favorito
     * @param id ID do veiculo
     * @returns Promise que, se resolvida, confirma a atualização
     */
    toggleFavorite(id) {
        return new Promise((resolve, reject) => {
            // Encontra o veículo pelo ID
            this.db.findOne({ _id: id }, (error, vehicle) => {
                // Se ocorrer um erro ou o veículo não for encontrado, rejeita a promise
                if (error) {
                    reject(error);
                }
                else if (!vehicle) {
                    reject(new Error("Veículo não encontrado."));
                }
                else {
                    // Inverte o valor de isFavorite
                    const updatedFavoriteStatus = !vehicle.isFavorite;
                    // Atualiza a base de dados com o novo valor de isFavorite
                    this.db.update({ _id: id }, { $set: { isFavorite: updatedFavoriteStatus } }, {}, (error, numUpdated) => {
                        // Se ocorrer erro ao atualizar, rejeita a promise
                        if (error) {
                            reject(error);
                        }
                        else if (numUpdated === 0) {
                            reject(new Error("Falha ao alterar o estado de favorito do veículo."));
                        }
                        else {
                            // Após a atualização, retorna o veículo atualizado
                            resolve(Object.assign(Object.assign({}, vehicle), { isFavorite: updatedFavoriteStatus }));
                        }
                    });
                    // Carrega a base de dados após a atualização
                    this.db.loadDatabase();
                }
            });
        });
    }
}
exports.Worker = Worker;
