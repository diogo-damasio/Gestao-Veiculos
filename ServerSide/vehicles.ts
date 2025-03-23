import * as path from "path";
const Datastore = require("nedb");

export interface IVehicle {
    _id ?: number , make: string, model: string, year: number, ownerId?: string, isFavorite: boolean;
}


export class Worker {
    private db: Nedb;
    constructor() {
        this.db = new Datastore ({
            filename: path.join(__dirname,"vehicles.db") ,
            autoload : true
        });
    }

    public listVehicles(ownerId?: string): Promise<IVehicle[]> {

        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {

            //Procura na base de dados os veículos com ownerID igual ao especificado
            this.db.find({ ownerId }, (error: Error | null, docs: IVehicle[]) => {

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
    public addVehicle(vehicle: IVehicle): Promise<IVehicle> {

        //Criação e retorno da promise
        return new Promise((resolve, reject) => {

            //Insere na base de dados o veículo especificado
            this.db.insert(vehicle, (error: Error | null, newDoc: IVehicle) => {
                
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
    public deleteVehicle(id: string): Promise<void> {

        //Criação e retorno da promise
        return new Promise((resolve, reject) => {

            //Remove o veiculo com o ID especificado da base de dados
            this.db.remove({ _id: id }, {}, (error: Error | null, numRemoved: number) => {

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
    public listFavorites(ownerId?: string): Promise<IVehicle[]> {

        //Criação e retorno da Promise
        return new Promise((resolve, reject) => {

            //Procura na base de dados os veículos favoritos com ownerID igual ao especificado
            this.db.find({ ownerId, isFavorite: true }, (error: Error | null, docs: IVehicle[]) => {

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
    public toggleFavorite(id?: string): Promise<IVehicle> {
        return new Promise((resolve, reject) => {
    
            // Encontra o veículo pelo ID
            this.db.findOne({ _id: id }, (error, vehicle) => {
    
                // Se ocorrer um erro ou o veículo não for encontrado, rejeita a promise
                if (error) {
                    reject(error);
                } else if (!vehicle) {
                    reject(new Error("Veículo não encontrado."));
                } else {
    
                    // Inverte o valor de isFavorite
                    const updatedFavoriteStatus = !vehicle.isFavorite;
    
                    // Atualiza a base de dados com o novo valor de isFavorite
                    this.db.update({ _id: id }, { $set: { isFavorite: updatedFavoriteStatus } }, {}, (error, numUpdated) => {
    
                        // Se ocorrer erro ao atualizar, rejeita a promise
                        if (error) {
                            reject(error);
                        } else if (numUpdated === 0) {
                            reject(new Error("Falha ao alterar o estado de favorito do veículo."));
                        } else {
                            // Após a atualização, retorna o veículo atualizado
                            resolve({ ...vehicle, isFavorite: updatedFavoriteStatus });
                        }
                    });
    
                    // Carrega a base de dados após a atualização
                    this.db.loadDatabase();
                }
            });
        });
    }    

}