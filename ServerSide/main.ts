import path from "path";                                                                                        
import express, { Express , NextFunction , Request , Response } from "express";                                 

import * as Vehicles from "./vehicles";
import { IVehicle } from "./vehicles";
import * as Users from "./users";
import { IUser } from "./users";
import * as Support from "./support";
import { ISupport } from "./support";


/**
 * Inicialização de aplicação Express, e adiciona middleware para processar corpos de requisições no formato JSON
 */
const app : Express = express() ;                                                                               
app.use(express.json());                                                                                        

/**
 * Configura um middleware para servir arquivos estáticos do lado Cliente
 */
app.use("/", express.static(path.join(__dirname,"../../Client/dist")));                            





/**
 * Middleware para configurar cabeçalhos de CORS (Cross-Origin Resource Sharing)
 * Permite que o servidor lide com requisições de diferentes origens
 */
app.use(function(inRequest: Request, inResponse: Response , inNext: NextFunction ) {

    //Define o cabeçalho para permitir solicitações de qualquer origem
    inResponse.header("Access-Control-Allow-Origin", "*");

    //Define os métodos HTTP permitidos para requisições de CORS
    inResponse.header ("Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS "
    );

    //Define os cabeçalhos que o cliente pode usar ao fazer requisições
    inResponse.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    inNext () ;
}) ;
    






/**
 * Listar todos os veículos presentes na base de dados
 */
app.get("/vehicles",

    //Função assíncrona (middleware) para listar todos os veículos da base de dados
    async(inRequest : Request , inResponse : Response ) => {

        try {

            //Cria um objeto do tipo Vehicles.Worker
            const vehiclesWorker: Vehicles.Worker = new Vehicles.Worker();

            //Cria um array de objetos IVehicle, cujo ID do proprietário é o ID do utilizador ativo
            const vehicles: IVehicle[] = await vehiclesWorker.listVehicles(Users.currentUser._id);
            
            //Envia uma resposta com o objeto `vehicles` no formato JSON
            inResponse.json(vehicles); 

        } catch (inError) {
            inResponse.send("error") ;
        }
    }
);



/**
 * Adicionar um veículo à base de dados
 */
app.post("/vehicles",

    //Função assíncrona (middleware) para adicionar um veículo à base de dados
    async( inRequest : Request , inResponse : Response ) => {
        try {

            //Cria um objeto do tipo Vehicles.Worker
            const vehicleWorker : Vehicles.Worker = new Vehicles.Worker();

            /* Adiciona o veículo do corpo da requisição à base de dados 
            Associa a este veículo o ID do utilizador ativo como ID do proprietário */
            const vehicle : IVehicle = await vehicleWorker.addVehicle({
                ...inRequest.body,
                ownerId: Users.currentUser._id
            });

            //Envia uma resposta com o objeto `vehicle` no formato JSON
            inResponse.json(vehicle);

        } catch ( inError ) {
            inResponse.send ("error");
        }
    }
);



/**
 * Remover um veículo da base de dados
 */
app.delete("/vehicles/:id",

    //Função assíncrona (middleware) para remover um veículo da base de dados
    async ( inRequest : Request , inResponse : Response ) => {
        try {

            //Cria um objeto do tipo Vehicles.Worker
            const vehiclesWorker : Vehicles.Worker = new Vehicles.Worker();

            //Remove da base de dados o veículo cujo ID é o passado no parâmetro da requisição
            await vehiclesWorker.deleteVehicle(inRequest.params.id);

            //Confirmação
            inResponse.send("ok");

        } catch ( inError ) {
            inResponse.send("error") ;
        }
    }
);    







/**
 * Listar todos os utilizadores da base de dados 
 */
app.get("/users",

    //Função assíncrona (middleware) para listar todos os utilizadores registados na base de dados
    async(inRequest : Request , inResponse : Response ) => {
        try {

            //Criar um objeto do tipo Users.Worker
            const usersWorker: Users.Worker = new Users.Worker();

            //Cria um array de objetos IUser, com todos os utilizadores registados na base de dados
            const users: IUser[] = await usersWorker.listUsers();  

            //Envia uma resposta com o objeto `users` no formato JSON
            inResponse.json(users); 

        } catch (inError) {
            inResponse.send("error") ;
        }
    }
);





/**
 * Registar utilizador, inserindo-o na base de dados
 */
app.post("/users",

    //Função assíncrona para adicionar utilizadores à base de dados
    async( inRequest : Request , inResponse : Response ) => {
        try {

            //Criar um objeto do tipo Users.Worker
            const usersWorker : Users.Worker = new Users.Worker();

            //Adiciona o utilizador do corpo da requisição à base de dados
            const user : IUser = await usersWorker.addUser(inRequest.body);
            
            //Envia uma resposta com o objeto `user` no formato JSON
            inResponse.json(user); 

        } catch ( inError ) {
            inResponse.send ("error");
        }
    }
);




/**
 * Remover utilizador da base de dados
 */
app.delete("/users/:id",

    //Função assíncrona para remover utilizador da base de dados
    async ( inRequest : Request , inResponse : Response ) => {
        try {

            //Criar objeto do tipo Users.Worker
            const usersWorker : Users.Worker = new Users.Worker();

            //Elimina da base de dados o utilizador cujo ID é o ID passado no parâmetro da requisição
            await usersWorker.deleteUser(inRequest.params.id);

            //Confirmação
            inResponse.send("ok");

        } catch ( inError ) {
            inResponse.send("error") ;
        }
    }
);    

/**
 * Lista todos os veiculos favoritos
 */
app.get("/vehicles/favorites",

    //Função assíncrona (middleware) para listar todos os veículos favoritos da base de dados
    async(inRequest : Request , inResponse : Response ) => {

        try {

            //Cria um objeto do tipo Vehicles.Worker
            const vehiclesWorker: Vehicles.Worker = new Vehicles.Worker();

            //Cria um array de objetos IVehicle favoritos, cujo ID do proprietário é o ID do utilizador ativo 
            const vehicles: IVehicle[] = await vehiclesWorker.listFavorites(Users.currentUser._id);
            
            //Envia uma resposta com o objeto `vehicles` no formato JSON
            inResponse.json(vehicles); 

        } catch (inError) {
            inResponse.send("error") ;
        }
    }
);




/**
 * Permite alterar o estado de favorito de um veiculo
 */
app.put("/vehicles/:id/favorite",
    
    
    //Função assíncrona (middleware) para alterar o estado de favorito de um veiculo
    async (inRequest : Request, inResponse : Response) => {
        try {

            //Criar objeto do tipo Vehicles.Worker
            const vehiclesWorker: Vehicles.Worker = new Vehicles.Worker();

            //Altera a palavra-passe e retorna o objeto IUser com as novas credenciais
            const favoriteVehicle = await vehiclesWorker.toggleFavorite(inRequest.params.id);

            //Retorna as novas credenciais
            if (favoriteVehicle) {
                inResponse.json(favoriteVehicle);
            } 
            
            else {
                inResponse.send("error");
            }
            
        } catch (inError) {
            inResponse.send("error");
        }
});



/**
 * Permite fazer login
 */
app.post("/login", 

    //Função assíncrona (middleware) para fazer login
    async (inRequest : Request, inResponse : Response) => {
        try {

            //Criar objeto do tipo Users.Worker
            const usersWorker: Users.Worker = new Users.Worker();

            /* Faz login com o nome e a palavra-passe passados no corpo da requisição
            Associa o resultado à variável user */
            const user = await usersWorker.login(inRequest.body.name, inRequest.body.password);

            /* Se houver um utilizador registado cujas credenciais sejam as da requisição,
             envia uma resposta com o objeto `user` no formato JSON */
            if (user) {
                inResponse.json(user);
            } 
            
            //Se não existir um utilizador com estas credenciais, envia mensagem de erro
            else {
                inResponse.send("Invalid credentials");
            }
            
        } catch (inError) {
            inResponse.send("error");
        }
});




/**
 * Permite alterar a palavra-passe do utilizador autenticado
 */
app.put("/change-password",
    
    
    //Função assíncrona (middleware) para atualizar a palavra-passe do utilizador autenticado
    async (inRequest : Request, inResponse : Response) => {
        try {

            //A nova palavra-passe encontra-se no corpo da requisição
            const newPwd = inRequest.body.newPassword;


            //Criar objeto do tipo Users.Worker
            const usersWorker: Users.Worker = new Users.Worker();

            //Altera a palavra-passe e retorna o objeto IUser com as novas credenciais
            const updatedUser = await usersWorker.changePassword(newPwd);

            //Retorna as novas credenciais
            if (updatedUser) {
                inResponse.json(updatedUser);
            } 
            
            else {
                inResponse.send("error");
            }
            
        } catch (inError) {
            inResponse.send("error");
        }
});


app.post("/support",

    async (inRequest : Request , inResponse : Response) => {
        try {
            const supportWorker : Support.Worker = new Support.Worker();
            const support : ISupport = await supportWorker.addMessage(inRequest.body);
            inResponse.json(support);
        } catch (inError) {
            inResponse.send("error");
        }
    }
);






//Coloca o servidor à escuta na porta 8080
app.listen(8080);

