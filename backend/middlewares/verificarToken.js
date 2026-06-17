import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ mensaje: "Token requerido" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ mensaje: "Formato de token inválido" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ mensaje: "JWT_SECRET no configurado en el servidor" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: "Token inválido o expirado" });
    req.user = decoded;
    next();
  });
}
