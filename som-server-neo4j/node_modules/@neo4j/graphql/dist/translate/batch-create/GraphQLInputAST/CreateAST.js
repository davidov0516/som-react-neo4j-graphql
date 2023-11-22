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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAST = void 0;
const AST_1 = require("./AST");
class CreateAST extends AST_1.AST {
    constructor(nodeProperties, node) {
        super();
        this.nodeProperties = nodeProperties;
        this.node = node;
    }
    accept(visitor) {
        visitor.visitCreate(this);
    }
}
exports.CreateAST = CreateAST;
//# sourceMappingURL=CreateAST.js.map