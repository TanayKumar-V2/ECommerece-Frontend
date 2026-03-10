const items = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    "https://images.unsplash.com/photo-1434389678369-1f4bf0be12de?w=800&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    "https://images.unsplash.com/photo-1556821840-025d57ddeb1b?w=800&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"
];

async function check() {
    for (const url of items) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            console.log(res.status, url);
        } catch (e) {
            console.log("Error", url);
        }
    }
}
check();
