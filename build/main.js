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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const Vehicles = __importStar(require("./vehicles"));
const Users = __importStar(require("./users"));
const Support = __importStar(require("./support"));
/**
 * Inicialização de aplicação Express, e adiciona middleware para processar corpos de requisições no formato JSON
 */
const app = (0, express_1.default)();
app.use(express_1.default.json());
/**
 * Configura um middleware para servir arquivos estáticos do lado Cliente
 */
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../Client/dist")));
/**
 * Middleware para configurar cabeçalhos de CORS (Cross-Origin Resource Sharing)
 * Permite que o servidor lide com requisições de diferentes origens
 */
app.use(function (inRequest, inResponse, inNext) {
    //Define o cabeçalho para permitir solicitações de qualquer origem
    inResponse.header("Access-Control-Allow-Origin", "*");
    //Define os métodos HTTP permitidos para requisições de CORS
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS ");
    //Define os cabeçalhos que o cliente pode usar ao fazer requisições
    inResponse.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    inNext();
});
/**
 * Listar todos os veículos presentes na base de dados
 */
app.get("/vehicles", 
//Função assíncrona (middleware) para listar todos os veículos da base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Cria um objeto do tipo Vehicles.Worker
        const vehiclesWorker = new Vehicles.Worker();
        //Cria um array de objetos IVehicle, cujo ID do proprietário é o ID do utilizador ativo
        const vehicles = yield vehiclesWorker.listVehicles(Users.currentUser._id);
        //Envia uma resposta com o objeto `vehicles` no formato JSON
        inResponse.json(vehicles);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Adicionar um veículo à base de dados
 */
app.post("/vehicles", 
//Função assíncrona (middleware) para adicionar um veículo à base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Cria um objeto do tipo Vehicles.Worker
        const vehicleWorker = new Vehicles.Worker();
        /* Adiciona o veículo do corpo da requisição à base de dados
        Associa a este veículo o ID do utilizador ativo como ID do proprietário */
        const vehicle = yield vehicleWorker.addVehicle(Object.assign(Object.assign({}, inRequest.body), { ownerId: Users.currentUser._id }));
        //Envia uma resposta com o objeto `vehicle` no formato JSON
        inResponse.json(vehicle);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Remover um veículo da base de dados
 */
app.delete("/vehicles/:id", 
//Função assíncrona (middleware) para remover um veículo da base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Cria um objeto do tipo Vehicles.Worker
        const vehiclesWorker = new Vehicles.Worker();
        //Remove da base de dados o veículo cujo ID é o passado no parâmetro da requisição
        yield vehiclesWorker.deleteVehicle(inRequest.params.id);
        //Confirmação
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Listar todos os utilizadores da base de dados
 */
app.get("/users", 
//Função assíncrona (middleware) para listar todos os utilizadores registados na base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Criar um objeto do tipo Users.Worker
        const usersWorker = new Users.Worker();
        //Cria um array de objetos IUser, com todos os utilizadores registados na base de dados
        const users = yield usersWorker.listUsers();
        //Envia uma resposta com o objeto `users` no formato JSON
        inResponse.json(users);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Registar utilizador, inserindo-o na base de dados
 */
app.post("/users", 
//Função assíncrona para adicionar utilizadores à base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Criar um objeto do tipo Users.Worker
        const usersWorker = new Users.Worker();
        //Adiciona o utilizador do corpo da requisição à base de dados
        const user = yield usersWorker.addUser(inRequest.body);
        //Envia uma resposta com o objeto `user` no formato JSON
        inResponse.json(user);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Remover utilizador da base de dados
 */
app.delete("/users/:id", 
//Função assíncrona para remover utilizador da base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Criar objeto do tipo Users.Worker
        const usersWorker = new Users.Worker();
        //Elimina da base de dados o utilizador cujo ID é o ID passado no parâmetro da requisição
        yield usersWorker.deleteUser(inRequest.params.id);
        //Confirmação
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Lista todos os veiculos favoritos
 */
app.get("/vehicles/favorites", 
//Função assíncrona (middleware) para listar todos os veículos favoritos da base de dados
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Cria um objeto do tipo Vehicles.Worker
        const vehiclesWorker = new Vehicles.Worker();
        //Cria um array de objetos IVehicle favoritos, cujo ID do proprietário é o ID do utilizador ativo 
        const vehicles = yield vehiclesWorker.listFavorites(Users.currentUser._id);
        //Envia uma resposta com o objeto `vehicles` no formato JSON
        inResponse.json(vehicles);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Permite alterar o estado de favorito de um veiculo
 */
app.put("/vehicles/:id/favorite", 
//Função assíncrona (middleware) para alterar o estado de favorito de um veiculo
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Criar objeto do tipo Vehicles.Worker
        const vehiclesWorker = new Vehicles.Worker();
        //Altera a palavra-passe e retorna o objeto IUser com as novas credenciais
        const favoriteVehicle = yield vehiclesWorker.toggleFavorite(inRequest.params.id);
        //Retorna as novas credenciais
        if (favoriteVehicle) {
            inResponse.json(favoriteVehicle);
        }
        else {
            inResponse.send("error");
        }
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Permite fazer login
 */
app.post("/login", 
//Função assíncrona (middleware) para fazer login
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Criar objeto do tipo Users.Worker
        const usersWorker = new Users.Worker();
        /* Faz login com o nome e a palavra-passe passados no corpo da requisição
        Associa o resultado à variável user */
        const user = yield usersWorker.login(inRequest.body.name, inRequest.body.password);
        /* Se houver um utilizador registado cujas credenciais sejam as da requisição,
         envia uma resposta com o objeto `user` no formato JSON */
        if (user) {
            inResponse.json(user);
        }
        //Se não existir um utilizador com estas credenciais, envia mensagem de erro
        else {
            inResponse.send("Invalid credentials");
        }
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
/**
 * Permite alterar a palavra-passe do utilizador autenticado
 */
app.put("/change-password", 
//Função assíncrona (middleware) para atualizar a palavra-passe do utilizador autenticado
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //A nova palavra-passe encontra-se no corpo da requisição
        const newPwd = inRequest.body.newPassword;
        //Criar objeto do tipo Users.Worker
        const usersWorker = new Users.Worker();
        //Altera a palavra-passe e retorna o objeto IUser com as novas credenciais
        const updatedUser = yield usersWorker.changePassword(newPwd);
        //Retorna as novas credenciais
        if (updatedUser) {
            inResponse.json(updatedUser);
        }
        else {
            inResponse.send("error");
        }
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
app.post("/support", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supportWorker = new Support.Worker();
        const support = yield supportWorker.addMessage(inRequest.body);
        inResponse.json(support);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
//Coloca o servidor à escuta na porta 8080
app.listen(8080);
