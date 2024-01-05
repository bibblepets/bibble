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
const mongoose_1 = __importStar(require("mongoose"));
const email_1 = require("../validators/email");
const password_1 = require("../validators/password");
const contactNumber_1 = require("../validators/contactNumber");
const bcrypt_1 = require("bcrypt");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [email_1.validateEmail, email_1.emailError]
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        validate: [password_1.validatePassword, password_1.passwordError]
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: String,
        trim: true,
        validate: [contactNumber_1.validateContactNumber, contactNumber_1.contactNumberError]
    },
    address: {
        country: {
            type: String,
            trim: true
        },
        streetAddress: {
            type: String,
            trim: true
        },
        unit: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        postcode: {
            type: String,
            trim: true
        }
    },
    profilePic: {
        name: {
            type: String
        }
    },
    bio: {
        type: String,
        trim: true
    }
}, {
    collection: 'users',
    timestamps: true,
    versionKey: false
});
UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = (0, bcrypt_1.hashSync)(this.password, 10);
    }
    next();
});
UserSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.password) {
        this._update.password = (0, bcrypt_1.hashSync)(this._update.password, 10);
    }
    next();
});
UserSchema.method('isCorrectPassword', function (password) {
    return (0, bcrypt_1.compareSync)(password, this.password);
});
const User = mongoose_1.default.model('User', UserSchema);
module.exports = User;
