import Button from '../../ui/button';

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

interface Product {
  id: string;
  name: string;
  price: number;
  stockStatus: StockStatus;
  img: string;
}

interface Props {
  product: Product;
  onAddToCart: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const { id, name, price, stockStatus, img } = product;

  // ドメインルール：在庫状態に応じた表示を判定
  const stockConfig: Record<
    StockStatus,
    { label: string; color: string; canBuy: boolean }
  > = {
    in_stock: { label: '在庫あり', color: 'green', canBuy: true },
    low_stock: { label: '残りわずか', color: 'orange', canBuy: true },
    out_of_stock: { label: '在庫なし', color: 'red', canBuy: false },
  };

  return (
    <div className="f-productCard">
      <img src={img} alt={name} width="200" height="200" />

      <p className="f-productCard__name">{name}</p>
      <p className="f-productCard__price">¥{price.toLocaleString()}</p>

      {/* ドメインルール：在庫状態バッジ */}
      <span
        className={`f-productCard__stock --${stockConfig[stockStatus].color}`}
      >
        {stockConfig[stockStatus].label}
      </span>

      {/* ドメインルール：在庫なしならボタンを無効化 */}
      <Button
        label="カートに追加"
        disabled={!stockConfig[stockStatus].canBuy}
        onClick={() => onAddToCart(id)}
      />
    </div>
  );
}
