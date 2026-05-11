// Usado em rotas de API — retorna 401 JSON
function requireAdminApi(req, res, next) {
  if (req.session?.adminId) return next();
  res.status(401).json({ erro: 'Não autenticado' });
}

// Usado em rotas de página HTML — redireciona para login
function requireAdminPage(req, res, next) {
  if (req.session?.adminId) return next();
  res.redirect('/admin');
}

module.exports = { requireAdminApi, requireAdminPage };
