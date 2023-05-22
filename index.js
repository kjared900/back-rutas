const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());
app.use(cors());

// Ruta para agregar un nuevo registro
app.post('/alumnos', (req, res) => {
    // Lee el archivo db.json
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        let alumnos = [];
        if (data) {
            alumnos = JSON.parse(data);
        }

        // Agrega el nuevo registro al arreglo de alumnos
        alumnos.push(req.body);

        // Guarda los datos actualizados en db.json
        fs.writeFile('db.json', JSON.stringify(alumnos), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error en el servidor');
            }

            res.status(201).json({message:'Registro agregado correctamente'});
        });
    });
});

app.get('/alumnos', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        const alumnos = JSON.parse(data);
        res.json(alumnos);
    });
});

// Ruta para obtener un alumno por su matrícula
app.get('/alumnos/:matricula', (req, res) => {
    const matricula = req.params.matricula;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        const alumnos = JSON.parse(data);
        const alumno = alumnos.find((alumno) => alumno.matricula === matricula);

        if (!alumno) {
            return res.status(404).send('Alumno no encontrado');
        }

        res.json(alumno);
    });
});

// Ruta para eliminar un alumno por su matrícula
app.delete('/alumnos/:matricula', (req, res) => {
    const matricula = req.params.matricula;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        let alumnos = JSON.parse(data);
        const alumnoIndex = alumnos.findIndex((alumno) => alumno.matricula === matricula);

        if (alumnoIndex === -1) {
            return res.status(404).send('Alumno no encontrado');
        }

        alumnos.splice(alumnoIndex, 1);

        fs.writeFile('db.json', JSON.stringify(alumnos), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error en el servidor');
            }

            res.send('Alumno eliminado correctamente');
        });
    });
});

// Ruta para actualizar completamente un alumno por su matrícula
app.put('/alumnos/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    const updatedAlumno = req.body;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }

        let alumnos = JSON.parse(data);
        const alumnoIndex = alumnos.findIndex((alumno) => alumno.matricula === matricula);

        if (alumnoIndex === -1) {
            return res.status(404).send('Alumno no encontrado');
        }

        // Reemplaza los datos del alumno por completo
        alumnos[alumnoIndex] = updatedAlumno;

        fs.writeFile('db.json', JSON.stringify(alumnos), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error en el servidor');
            }

            res.send('Alumno actualizado correctamente');
        });
    });
});



// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
