const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
app.use(bodyParser.json());

// Substitua pelo caminho correto do seu JSON de chave privada
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Webhook principal
app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  if (intent === 'ConsultarHorarioDia') {
    const dia = req.body.queryResult.parameters['dia']?.toLowerCase();

    try {
      const snapshot = await db.collection('horariosDeAulas')
        .where('diaDaSemana', '==', dia)
        .orderBy('horaInicio')
        .get();

      if (snapshot.empty) {
        return res.json({ fulfillmentText: `Não encontrei aulas para ${dia}.` });
      }

      const aulas = [];
      snapshot.forEach(doc => {
        const a = doc.data();
        aulas.push(`${a.disciplina} às ${a.horaInicio} na ${a.local}`);
      });

      return res.json({ fulfillmentText: `Aulas de ${dia}:\n${aulas.join('\n')}` });

    } catch (e) {
      console.error(e);
      return res.json({ fulfillmentText: `Erro ao buscar os dados de ${dia}.` });
    }
  }

  res.json({ fulfillmentText: 'Desculpe, não entendi sua pergunta.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
