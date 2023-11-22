import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createServer } from 'https';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({
  dest: 'uploads/', limits: {
    fileSize: 100 * 1024 * 1024
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

const typeDefs = `#graphql
  type Platoon {
    _id: ID!
    name: String
  }

  type Duty {
    _id: ID!
    name: String
  }

  type Job {
    _id: ID!
    name: String
  }

  type Department {
    _id: ID!
    name: String
  }

  type WaterArea {
    _id: ID!
    name: String
    note: String
  }

  type Charterer {
    _id: ID!
    company: String
    nation: String
    phone: String
    email: String
    note: String
  }

  type CertificateType {
    _id: ID!
    type: String
    name: String
    issuingAgency: String
    note: String
  }
  
  type MarinerGraduated {
    date: Date
    note: String
  }
	
  type Mariner {
    _id: ID!
    birthday: Date
    boardedYears: Int
    code: Int
    dailyFee: Int
    duty: Duty @relationship(type: "HAS_DUTY", direction: OUT)
    homePhone: String
    image: String
    job: Job @relationship(type: "HAS_JOB", direction: OUT)
    mobilePhone: String
    name: String
    note: String
    placeOfBorn: String
    placeOfResidence: String
    platoon: Platoon @relationship(type: "IS_IN", direction: OUT)
    previousAffiliation: String
    qualificationGrade: String
    registered: Date
    removed: String
    retired: String
    ship: Ship @relationship(type: "IS_ON", direction: OUT)
    graduated: MarinerGraduated @relationship(type: "HAS_GRADUATED", direction: OUT)
    certificates: [Certificate!]! @relationship(type: "IS_FOR_MARINER", direction: IN)
  }

  type Ship {
    _id: ID!
    vesselName: String
    registered: Date
    removed: Date
    images: [String]
    shipType: String
    yearOfBuild: Int
    flag: String
    homePort: String
    regNumber: String
    callsign: String
    imoNumber: String
    grossTonnage: Int
    netTonnage: Int
    deadWeight: Int
    length: Int
    beam: Int
    depth: Int
    draught: Int
    note: String
    certificates: [Certificate!]! @relationship(type: "IS_FOR_SHIP", direction: IN)
  }

  type CertificateIssue {
    putIn: Date
    department: Department @relationship(type: "ISSUED_BY", direction: OUT)
    id: String
    issue: Date
    expire: Date
    account: String
    price: Int
    registrationFee: Int
  }

  type Certificate {
    _id: ID!
    type: String
    certificateType: CertificateType @relationship(type: "IS_TYPE_OF", direction: OUT)
    ship: Ship @relationship(type: "IS_FOR_SHIP", direction: OUT)
    person: Mariner @relationship(type: "IS_FOR_MARINER", direction: OUT)
    issue: CertificateIssue @relationship(type: "ISSUED", direction: OUT)
  }
`;

const driver = neo4j.driver(
  "bolt://192.168.140.202:7687",
  neo4j.auth.basic("neo4j", "asdfasdf"),
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const apolloServer = new ApolloServer({
  schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(apolloServer, {
  context: async ({ req }) => ({ req, sessionConfig: { database: "som" } }),
  listen: { port: 8084 },
});

console.log(`🚀 Apollo Server ready at ${url}`);

// const options = {
//   key: fs.readFileSync('https-files/server.key'),
//   cert: fs.readFileSync('https-files/server.crt'),
// };

// const httpsServer = createServer(options, app);

// httpsServer.listen(8083, () => {
//   console.log(`Https Server is up at port https://localhost:${8083}`);
// });

app.listen(8083, () => {
  console.log(`Http Server is up at port https://localhost:${8083}`);
});