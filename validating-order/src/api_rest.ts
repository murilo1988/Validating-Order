import express, { Request, Response } from "express";
import { validate } from "./validateCPF";
import pgp from "pg-promise";
const app = express();
app.use(express.json());
app.post("/checkout", async function (req: Request, res: Response) {
  const connection = pgp()("postgres://postgres:postgres@localhost:5432/cacct11");
  try {
    if (validate(req.body.cpf)) {
      const output = {
        subtotal: 0,
        freight: 0,
        total: 0
      };
      if (req.body.items) {
        for (const item of req.body.items) {
          if (item.quantity <= 0) throw new Error("Invalid quantity")
          if (req.body.items.filter((i: any) => i.idProduct === item.idProduct).length > 1) throw new Error("Duplicated item")
          const [productData] = await connection.query("select * from cacct11.product where id_product = $1", [item.idProduct]);
          const price = parseFloat(productData.price);
          output.subtotal += price * item.quantity;
          if (req.body.from && req.body.to) {
            const volume = productData.width / 100 * productData.height / 100 * productData.length / 100
            const density = parseFloat(productData.weight) / volume
            let freight = volume * 1000 * (density / 100)
            output.freight += freight * item.quantity
          }
        }
      }
      output.total = output.subtotal
      if (req.body.coupon) {
        const [couponData] = await connection.query("select * from cacct11.coupon where code = $1", [req.body.coupon]);
        const today = new Date()

        if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
          output.total -= (output.total * parseFloat(couponData.percentage)) / 100;
        }
      }
      output.total += output.freight
      res.json(output);
    } else {
      res.json({
        message: "Invalid cpf"
      });
    }
  } catch (e: any) {
    res.status(422).json({ message: e.message })
  } finally {
    await connection.$pool.end()
  }
});
app.listen(3000);