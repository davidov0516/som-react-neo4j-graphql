"use strict";
/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jGraphQLAuthorization = void 0;
const debug_1 = __importDefault(require("debug"));
const constants_1 = require("../../constants");
const jose_1 = require("jose");
const parse_request_token_1 = require("./parse-request-token");
const debug = (0, debug_1.default)(constants_1.DEBUG_AUTH);
class Neo4jGraphQLAuthorization {
    constructor(authorization) {
        if (typeof authorization.key === "function") {
            this.unresolvedKey = authorization.key;
        }
        else {
            this.resolvedKey = this.serializeKey(authorization.key);
        }
        this.authorization = authorization;
    }
    async decode(context) {
        const bearerToken = context.token;
        if (!bearerToken) {
            return undefined;
        }
        const token = (0, parse_request_token_1.parseBearerToken)(bearerToken);
        if (!token) {
            return undefined;
        }
        try {
            if (this.authorization.verify === false) {
                debug("Skipping verifying JWT as verify is set to false");
                return (0, jose_1.decodeJwt)(token);
            }
            const secret = this.resolveKey(context);
            return await this.verify(token, secret);
        }
        catch (error) {
            debug("%s", error);
            return undefined;
        }
    }
    serializeKey(key) {
        if (typeof key === "string") {
            return Buffer.from(key);
        }
        else {
            return (0, jose_1.createRemoteJWKSet)(new URL(key.url), key.options);
        }
    }
    resolveKey(context) {
        if (this.resolvedKey) {
            return this.resolvedKey;
        }
        else {
            // this.unresolvedKey is definitely defined due to typings and if/else
            const resolved = this.unresolvedKey(context);
            return this.serializeKey(resolved);
        }
    }
    async verify(token, secret) {
        if (secret instanceof Uint8Array) {
            debug("Verifying JWT using secret");
            const { payload } = await (0, jose_1.jwtVerify)(token, secret, this.authorization.verifyOptions);
            return payload;
        }
        debug("Verifying JWKS using url");
        const { payload } = await (0, jose_1.jwtVerify)(token, secret, this.authorization.verifyOptions);
        return payload;
    }
}
exports.Neo4jGraphQLAuthorization = Neo4jGraphQLAuthorization;
//# sourceMappingURL=Neo4jGraphQLAuthorization.js.map