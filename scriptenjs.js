const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
// Creo la clase
class ProductManager {
  constructor() {
    // Genero la conexión con la base de datos
    this.db = new sqlite3.Database("ejemplo.db");
  }

  search_data() {
    return new Promise((resolve, reject) => {
      // Consulta para buscar los 3 productos más baratos(con el nombre del proveedor), ordenados por precio
      this.db.all(
        `
                SELECT products.name, providers.name AS provider_name, products.price
                FROM products
                JOIN providers ON products.provider_id = providers.id
                ORDER BY products.price ASC
                LIMIT 3
            `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  // función para crear el html necesario para el documento salida.html
  render_view(data) {
    let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Productos más baratos</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
                <style>
                    .precioMin {
                        background-color: #98FB98;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Productos más baratos</h1>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nombre del Producto</th>
                                <th>Proveedor</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
    // inserto en la tabla los datos que me devuelve la consulta
    data.forEach((row) => {
      const { name, provider_name, price } = row;
      html += `
                <tr ${row === data[0] ? 'class="precioMin"' : ""}>
                    <td>${name}</td>
                    <td>${provider_name}</td>
                    <td>${price}€</td>
                </tr>
            `;
    });

    html += `
                        </tbody>
                    </table>
                    <button id="toggle-button" class="btn btn-danger">Ocultar tabla</button>
                    <button id="modal-button" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Mostrar Saludo</button>

                    <!-- Modal -->
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Saludo</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            Hola Iván o Rubén, espero que os guste mi código
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                          </div>
                        </div>
                      </div>
                    </div>

                </div>

                <!-- JavaScript Bundle with Popper -->
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>

                <script>
                    const toggleButton = document.getElementById('toggle-button');
                    const table = document.querySelector('.table');
            
                    toggleButton.addEventListener('click', () => {
                        table.classList.toggle('d-none');
            
                        if (table.classList.contains('d-none')) {
                            toggleButton.textContent = 'Mostrar Tabla';
                            toggleButton.classList.remove('btn-danger');
                            toggleButton.classList.add('btn-success');
                        } else {
                            toggleButton.textContent = 'Ocultar Tabla';
                            toggleButton.classList.remove('btn-success');
                            toggleButton.classList.add('btn-danger');
                        }
                    });
                </script>

            </body>
            </html>
        `;

    return html;
  }
  // función para generar el archivo salida.html
  run() {
    this.search_data()
      .then((data) => {
        const html = this.render_view(data);
        // creo el documento salida.html
        fs.writeFile("salidajs.html", html, (err) => {
          if (err) {
            console.error(err);
          } else {
            // envío por consola mensaje de éxito
            console.log("Archivo creado: salidajs.html");
          }
        });
      })
      .catch((err) => {
        console.error(err);
      })
      // cierro la conexión con la base de datos
      .finally(() => {
        this.db.close();
      });
  }
}
// Creo una instancia de la clase
const productManager = new ProductManager();
// Llamo al método 'run'
productManager.run();
