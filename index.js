const express = require('express');
const app = express();
const path = require('path')
const PORT = 3000;
const ip = 'localhost'
const mysql = require('mysql');
const bodyParser = require('body-parser');


app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server en http://${ip}:${PORT}`)
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const conexion = mysql.createConnection({
    host: "localhost",
    database: "db_consultas",
    user: "root",
    password: "admin",
    port: 33060
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Manejo de la solicitud POST del formulario
app.post('/submit-form', (req, res) => {
    const { nombres, apellidos, celular, gmail, consulta } = req.body;

    const query = 'INSERT INTO consultas (nombres, apellidos, celular, gmail, consulta) VALUES (?, ?, ?, ?, ?)';
    conexion.query(query, [nombres, apellidos, celular, gmail, consulta], (err, result) => {
        if (err) {
            console.error('Error al insertar datos: ' + err.stack);
            res.status(500).send('Ocurrió un error al procesar tu consulta.');
            return;
        }

        // Envía una respuesta con el HTML completo de la página a la que deseas redirigir, con el mensaje de "Formulario enviado"
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Redireccionando...</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f3f3f3;
                    }

                    .loader-container {
                        text-align: center;
                    }

                    .loader {
                        border: 4px solid #f3f3f3; /* Light grey */
                        border-top: 4px solid #3498db; /* Blue */
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 2s linear infinite;
                        margin-bottom: 20px;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .message {
                        font-size: 20px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="loader-container">
                    <div class="loader"></div>
                    <p class="message">Formulario enviado. Redireccionando...</p>
                </div>
                <meta http-equiv="refresh" content="3;url=http:${ip}///index.html">
            </body>
            </html>
        `);
    });
});