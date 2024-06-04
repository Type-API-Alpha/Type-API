"use strict";
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
const err_1 = require("../utils/err");
const user_service_1 = __importDefault(require("../services/user-service"));
const response_1 = __importDefault(require("../utils/response"));
class UserController {
    static createNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.createUser(req.body);
                const response = (0, response_1.default)(true, user, null);
                console.log(response);
                res.status(201).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error.');
                console.log(err);
                if (err instanceof err_1.ConflictError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
}
exports.default = UserController;
