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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const key_error_1 = require("../errors/key.error");
const mongoose_1 = require("mongoose");
const validation_error_1 = require("../errors/validation.error");
const User = require('../models/user.model');
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = req.query;
    let user;
    try {
        if (id) {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new validation_error_1.ValidationError('Invalid query parameter', 'id', id);
            }
            user = yield User.findById(id);
            if (!user) {
                throw new key_error_1.KeyNotFoundError('User not found', 'id', id);
            }
        }
        else if (email) {
            user = yield User.findOne({ email });
            if (!user) {
                throw new key_error_1.KeyNotFoundError('User not found', 'email', email);
            }
        }
        console.log('HIHI');
        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
