export const rankProducts = (products = []) => {

    return products.sort((a, b) => {

        if (b.stock !== a.stock) {
            return b.stock - a.stock;
        }

        return a.price - b.price;

    });

};