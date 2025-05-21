**Major Project :**

**Backend:**

**Part1:**
**Challenge:** Create the api routes and models as per the data needed in your app.

 1.**Products  Routes**
Create the following Routes relating to Products.

**1. Functionality:** This API call gets all products from the db.
         GET /api/products


**2. Functionality:** This API call gets product by productId from the db.
         GET /api/products/:productId
         Request URL: /api/products/:productId

**Category Routes**
Create the following Routes relating to Categories.

**1. Functionality:** This API call gets all categories from the db.
           GET /api/categories

**2. Functionality:** This API call gets category by categoryId from the db.
            GET /api/categories/:categoryId

**Part 2**
Add the necessary apis and models needed for the new features for your project.

**Challenge:** Write the required APIs for:

**Wishlist Management:**
**Features:**
1. Made functionality to get all product in wishlist so when from the navbar, you can navigate to your wishlist where all the products that you liked and wish to buy in future are mentioned.
GET /wishlist/
2. Also made add to wishlist functionality to add product to wishlist
post/wishlist/
3. added functionality to remove product from wishlist
delete/wishlist/:produtId

**Cart Management**
**Features:**
1. Made functionality to get all product in cart so when From the navbar, you can navigate to the cart where all the products that you want to buy are mentioned.
GET /cart/
2.Also made add to cart functionality to add product to cart while checking if product is already present increase only the quantity by one 
post/cart/
3. added functionality to decrease product quantity from cart
delete/cart/:id 
4. added functionality to remove all product from cart
delete/cart/
**Address Management**
**Features:**
You can add multiple addresses, update or delete them.
1. Getting all the address 
get/address/
2.Get address by  userId
get/address/user/:userId
3. Add new address
post/address/
4. Update adress
put/address/:id
5. Delete address
delete/address/:id
 **Git repo link**:  https://github.com/parthgoyal13/e-commerceWeb-backend
