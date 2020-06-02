const express = require('express');
const authMiddleware = require('../middleware/auth');

const Project = require('../models/project');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        const projects = await Project.find().populate(['user', 'tasks']);

        return res.send({ projects });
    }catch(err){
        return res.status(400).send({error: "Erro ao carregar projetos, tente novamente"});
    }
});


router.get('/:projectId', async (req, res) => {
    try{
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send({ project });
    }catch(err){
        return res.status(400).send({error: "Erro ao carregar projetos do usuário, tente novamente"});
    }
});

module.exports = app => app.use('/projects', router);