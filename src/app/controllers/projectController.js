const express = require('express');
const authMiddleware = require('../middleware/auth');

const Project = require('../models/project');
const Task = require('../models/task');

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

router.post('/', async (req, res) => {
    try{       
        const { title, description, tasks }  = req.body;

        const project = await Project.create({title, description , user: req.userId});

        await Promise.all(tasks.map(async task => {            
            const projectTask = new Task({...task, project: project._id});            
            await projectTask.save();
            
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send( {project} );
    }catch(err){
        return res.status(400).send({error: 'Erro ao cadastrar novo projeto, tente novamente'});
    }
});

module.exports = app => app.use('/projects', router);