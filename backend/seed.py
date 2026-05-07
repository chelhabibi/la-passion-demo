from database import SessionLocal, engine, Base
from models import MenuItem

Base.metadata.create_all(bind=engine)

MENU_ITEMS = [
    # Starters / Khai vị
    {
        "name_vi": "Gan Ngỗng Béo Ướp Cognac",
        "name_en": "Cognac-Cured Foie Gras",
        "description_vi": "Gan ngỗng béo ướp cognac XO, phục vụ với bánh mì brioche nướng và mứt sung Đà Lạt",
        "description_en": "Foie gras cured in XO cognac, served with toasted brioche and Dalat fig compote",
        "price": 380000,
        "category": "starter",
        "image_url": "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=800&q=80",
    },
    {
        "name_vi": "Sò Điệp Nướng Bơ Chanh",
        "name_en": "Seared Dalat Scallop",
        "description_vi": "Sò điệp Đà Lạt áp chảo bơ nâu, tinh dầu chanh leo, cải rocket tươi",
        "description_en": "Pan-seared Dalat scallop with brown butter, passionfruit oil, fresh rocket",
        "price": 295000,
        "category": "starter",
        "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    },
    {
        "name_vi": "Cá Ngừ Tươi Tartare",
        "name_en": "Bluefin Tuna Tartare",
        "description_vi": "Cá ngừ vây xanh thái hạt lựu, wasabi tươi, trứng cá hồi, giòn bánh mì đen",
        "description_en": "Bluefin tuna brunoise, fresh wasabi, salmon roe, black bread crisp",
        "price": 320000,
        "category": "starter",
        "image_url": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80",
    },
    {
        "name_vi": "Súp Hành Tây Kiểu Pháp",
        "name_en": "French Onion Soup",
        "description_vi": "Hành tây caramel hầm 6 tiếng, nước dùng bò đậm đà, bánh mì nướng phủ gruyère tan chảy",
        "description_en": "6-hour caramelised onion, rich beef consommé, gruyère crouton",
        "price": 195000,
        "category": "starter",
        "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    },
    # Mains / Chính
    {
        "name_vi": "Vịt Confit Sốt Cam Tươi",
        "name_en": "Duck Confit, Citrus Jus",
        "description_vi": "Đùi vịt confit truyền thống, sốt cam tươi Hội An, khoai tây rán giòn, cải xoong",
        "description_en": "Traditional duck leg confit, Hoi An fresh orange jus, pommes sarladaises, watercress",
        "price": 485000,
        "category": "main",
        "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    },
    {
        "name_vi": "Thăn Bò Wagyu Áp Chảo",
        "name_en": "Wagyu Beef Tenderloin",
        "description_vi": "Thăn bò Wagyu A4 nấu sous-vide, sốt Bordelaise, nấm truffle đen, măng tây xanh",
        "description_en": "A4 Wagyu tenderloin sous-vide, Bordelaise sauce, black truffle, green asparagus",
        "price": 980000,
        "category": "main",
        "image_url": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    },
    {
        "name_vi": "Cá Vược Biển Hấp Rau Thơm",
        "name_en": "Sea Bass en Papillote",
        "description_vi": "Cá vược biển hấp giấy nến, rau thơm Việt, gừng tươi, sốt bơ chanh",
        "description_en": "Sea bass steamed in parchment with Vietnamese herbs, fresh ginger, lemon butter",
        "price": 420000,
        "category": "main",
        "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    },
    {
        "name_vi": "Nai Rừng Nướng Sốt Rượu Vang",
        "name_en": "Venison, Red Wine Reduction",
        "description_vi": "Thăn nai Tây Nguyên nướng medium-rare, sốt rượu vang đỏ Bordeaux, củ cải tím hầm",
        "description_en": "Central Highlands venison loin, Bordeaux reduction, braised purple turnip",
        "price": 650000,
        "category": "main",
        "image_url": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80",
    },
    {
        "name_vi": "Risotto Nấm Rừng & Truffle",
        "name_en": "Wild Mushroom & Truffle Risotto",
        "description_vi": "Risotto Arborio nấm rừng Mộc Châu, dầu truffle đen, Parmigiano Reggiano 36 tháng",
        "description_en": "Arborio risotto with Moc Chau wild mushrooms, black truffle oil, 36-month Parmigiano",
        "price": 360000,
        "category": "main",
        "image_url": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    },
    # Desserts / Tráng miệng
    {
        "name_vi": "Crème Brûlée Vanilla Tahiti",
        "name_en": "Tahitian Vanilla Crème Brûlée",
        "description_vi": "Kem trứng vanilla Tahiti nướng, lớp đường caramel giòn, quả mâm xôi tươi",
        "description_en": "Classic custard with Tahitian vanilla, crackling caramel crust, fresh raspberries",
        "price": 175000,
        "category": "dessert",
        "image_url": "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80",
    },
    {
        "name_vi": "Bánh Chocolate Fondant Nóng",
        "name_en": "Dark Chocolate Fondant",
        "description_vi": "Bánh chocolate đen 70% Valrhona, nhân lỏng tan chảy, kem vanilla Bourbon",
        "description_en": "70% Valrhona dark chocolate, molten lava centre, Bourbon vanilla ice cream",
        "price": 195000,
        "category": "dessert",
        "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    },
    {
        "name_vi": "Tarte Tatin Táo Caramel",
        "name_en": "Apple Tarte Tatin",
        "description_vi": "Táo Sa Pa caramel nướng ngược, bơ Bretagne, kem fraîche tươi",
        "description_en": "Sa Pa apple caramelised upside-down tart, Bretagne butter, fresh crème fraîche",
        "price": 165000,
        "category": "dessert",
        "image_url": "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80",
    },
    {
        "name_vi": "Mille-Feuille Kem Matcha",
        "name_en": "Matcha Mille-Feuille",
        "description_vi": "Ngàn lớp bánh phồng, kem matcha Uji Nhật Bản, bột đường hoa oải hương",
        "description_en": "Thousand-layer pastry, Uji matcha cream, lavender icing sugar",
        "price": 185000,
        "category": "dessert",
        "image_url": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80",
    },
    # Drinks / Đồ uống
    {
        "name_vi": "Rượu Vang Đỏ Bordeaux",
        "name_en": "Bordeaux Red Wine",
        "description_vi": "Tuyển chọn Château Margaux, Pauillac — phối hợp hoàn hảo với các món thịt đỏ",
        "description_en": "Château Margaux selection, Pauillac — perfect pairing with red meat mains",
        "price": 320000,
        "category": "drink",
        "image_url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    },
    {
        "name_vi": "Cocktail La Passion Đặc Trưng",
        "name_en": "La Passion Signature Cocktail",
        "description_vi": "Gin tươi, chanh leo Đà Lạt, elderflower tonic, hoa oải hương — cảm hứng từ khu phố cổ",
        "description_en": "Fresh gin, Dalat passionfruit, elderflower tonic, lavender — inspired by the Old Quarter",
        "price": 185000,
        "category": "drink",
        "image_url": "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=800&q=80",
    },
    {
        "name_vi": "Trà Thảo Mộc Nội Địa",
        "name_en": "Vietnamese Herbal Tea",
        "description_vi": "Hỗn hợp thảo mộc tươi: sả, gừng, húng quế — phục vụ trong ấm sứ trắng",
        "description_en": "Fresh herb blend: lemongrass, ginger, holy basil — served in white porcelain teapot",
        "price": 95000,
        "category": "drink",
        "image_url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    },
    # Signature Combos / Set Menu
    {
        "name_vi": "La Passion Experience · 5 Món",
        "name_en": "La Passion Experience · 5 Courses",
        "description_vi": "Khai vị · Súp · Cá vược biển · Thăn bò Wagyu · Tráng miệng theo mùa. Bao gồm bánh mì Pháp và bơ Bretagne. Wine pairing tùy chọn.",
        "description_en": "Amuse-bouche · Soup · Sea bass · Wagyu beef tenderloin · Seasonal dessert. Includes French bread and Bretagne butter. Optional wine pairing.",
        "price": 1450000,
        "category": "combo",
        "image_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    },
    {
        "name_vi": "Chef's Table · 7 Món",
        "name_en": "Chef's Table · 7 Courses",
        "description_vi": "Menu đặc biệt do Chef Minh Tú trực tiếp thiết kế theo mùa — gan ngỗng · sò điệp · cá ngừ · nai rừng · pho mát · tráng miệng · petit fours. Giới hạn 4 bàn mỗi tối.",
        "description_en": "Exclusive seasonal menu personally designed by Chef Minh Tú — foie gras · scallop · tuna · venison · cheese · dessert · petit fours. Limited to 4 tables per evening.",
        "price": 2200000,
        "category": "combo",
        "image_url": "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
    },
    {
        "name_vi": "Déjeuner · Trưa 3 Món",
        "name_en": "Déjeuner · 3-Course Lunch",
        "description_vi": "Khai vị chọn 1 · Món chính chọn 1 · Tráng miệng theo ngày. Phục vụ 11:30–14:30. Bao gồm cà phê hoặc trà thảo mộc.",
        "description_en": "Starter of your choice · Main of your choice · Dessert of the day. Served 11:30–14:30. Includes coffee or herbal tea.",
        "price": 750000,
        "category": "combo",
        "image_url": "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=800&q=80",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(MenuItem).count()
        if existing > 0:
            print(f"Already has {existing} menu items, skipping seed.")
            return
        for item in MENU_ITEMS:
            db.add(MenuItem(**item))
        db.commit()
        print(f"Seeded {len(MENU_ITEMS)} menu items.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
