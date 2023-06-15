import sqlite3
import string
import random

class ProductManager:
    # Método para inicializar la clase
    def __init__(self):
        # Establezco la conexión con la base de datos
        self.connection = sqlite3.connect('ejemplo.db')
        # Creo un objeto de cursor asociado a la base de datos
        self.cursor = self.connection.cursor()
        # Llamo al método 'create_tables' 
        self.create_tables()

    def create_tables(self):
        # Compruebo si existen las tablas, si no existen las creo
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS products 
            (id INTEGER PRIMARY KEY, 
            provider_id INTEGER, 
            price REAL, 
            name TEXT)''')
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS providers 
            (id INTEGER PRIMARY KEY, 
            name TEXT)''')
        self.connection.commit()

    def store_data(self):
        providers = ['Sara', 'Iván', 'Rubén']
        names = ['Lápiz', 'Bolígrafo', 'Mesa', 'Silla', 'Manzana', 'Naranja', 'Taza', 'Plato', 'Ratón', 'Zapato', 'Camiseta', 'Cartera', 'Chicles', 'Teléfono', 'Guantes']

        # Insertar proveedores
        for provider in providers:
            self.cursor.execute('''
                INSERT INTO providers 
                (name) 
                VALUES (?)''', (provider,))
        
        # Inserto 15 productos
        for i in range(15):
            name = names[i]
            price = round(random.uniform(1, 100),2)
            provider_id = random.randint(1, 3)
            self.cursor.execute('''
            INSERT INTO products 
            (provider_id, name, price) 
            VALUES (?, ?, ?)''', (provider_id, name, format(price, '.2f')))
        
        self.connection.commit()

    def __del__(self):
        # Cierro la conexión con la base de datos
        self.connection.close()

# Creo una instancia de la clase
product_manager = ProductManager()
# Llamo al método 'store_data' para generar y almacenar los datos
product_manager.store_data()
