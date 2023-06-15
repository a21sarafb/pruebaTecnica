<?php
// Creo la clase
class ProductManager {
    private $db;

    public function __construct() {
        // Genero la conexión con la base de datos
        $this->db = new SQLite3('ejemplo.db');
    }

    public function search_data() {
        $results = [];
        // Consulta para buscar los 3 productos más baratos(con el nombre del proveedor), ordenados por precio 
        $query = 'SELECT products.name as product_name, products.price as product_price, providers.name as provider_name 
                    FROM products 
                    JOIN providers 
                    ON products.provider_id = providers.id 
                    ORDER BY products.price ASC 
                    LIMIT 3';
        $result = $this->db->query($query);
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $results[] = $row;
        }
        // devuelvo el resultado
        return $results;
    }

    public function render_view($data) {
        // creo el código html necesario para el documento salida.html
        $html = '<!DOCTYPE html><html><head><title>Productos más baratos</title>';
        $html .= '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">';
        $html .= '<style>.precioMin {background-color: #98FB98;}</style>';
        $html .= '</head><body><div class="container">';
        $html .= '<h1>Productos más baratos</h1>';
        $html .= '<table class="table"><thead><tr><th>Producto</th><th>Precio</th><th>Proveedor</th></tr></thead><tbody>';
        // inserto en la tabla los datos que me devuelve la consulta y le añado la clase a la primera fila
        foreach ($data as $index => $row) {
            $highlightClass = ($index === 0) ? 'precioMin' : '';
            $html .= '<tr class="' . $highlightClass . '"><td>' . htmlspecialchars($row['product_name']) . '</td><td>' . htmlspecialchars($row['product_price']) . '</td><td>' . htmlspecialchars($row['provider_name']) . '</td></tr>';
        }
        $html .= '</tbody></table>';
        $html .= '<button id="toggle-button" class="btn btn-danger">Ocultar tabla</button>';
        $html .= '<button id="modal-button" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Mostrar Saludo</button>';
        $html .= '<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">';
        $html .= '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Saludo</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>';
        $html .= '<div class="modal-body">Hola Iván o Rubén, espero que os guste mi código</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button></div></div></div></div>';
        $html .= '</div>';
        $html .= '<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>';
        $html .= '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>';
        $html .= '<script>const toggleButton = document.getElementById("toggle-button"); const table = document.querySelector(".table");toggleButton.addEventListener("click", () => { table.classList.toggle("d-none");if (table.classList.contains("d-none")) {toggleButton.textContent = "Mostrar Tabla";toggleButton.classList.remove("btn-danger");toggleButton.classList.add("btn-success");} else {toggleButton.textContent = "Ocultar Tabla";toggleButton.classList.remove("btn-success");toggleButton.classList.add("btn-danger");}});</script>';
        $html .= '</body></html>';
        // genero el documento salida.html
        file_put_contents('salidaphp.html', $html);
    }

    public function run() {
        try {
            // Llamo al método 'search_data' y guardo el resultado en la variable '$data'
            $data = $this->search_data();
            // Genero el documento salida.html con los datos obtenidos de la linea anterior
            $this->render_view($data);
            echo "Archivo creado: salidaphp.html\n";
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
        } finally {
            // Cierro la conexión con la base de datos
            if ($this->db) {
                $this->db->close();
            }
        }
    }
}
// Creo una instancia de la clase
$productManager = new ProductManager();
// Llamo al método run
$productManager->run();
