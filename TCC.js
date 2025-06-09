
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// 2. SUAS Configurações do Firebase - COPIE AS DO SEU PROJETO TCC448 2!
// Vá em Configurações do Projeto > Geral > Seus apps
const firebaseConfig = {
  apiKey: "AIzaSyDvk0MqNv4hWPJflIIUvZzv7_Y2FtAVMY8", // <<-- COPIE DO SEU PROJETO
  authDomain: "tcc448-2.firebaseapp.com", // <<-- COPIE DO SEU PROJETO
  projectId: "tcc448-2", // O ID do seu projeto já está aqui!
  storageBucket: "tcc448-2.firebasestorage.app", // <<-- COPIE DO SEU PROJETO
  messagingSenderId: "798997552668", // <<-- COPIE DO SEU PROJETO
  appId: "1:798997552668:web:1b62c00c3b4a7f2ce7c9d9", // <<-- COPIE DO SEU PROJETO
  measurementId: "G-08YPTD6DEC" // Opcional, se usar Analytics - COPIE DO SEU PROJETO
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


async function adicionarHorarioDeAula(disciplina, dia, horaInicio, local) {
  try {
    
    const colecaoDeHorarios = collection(db, "horariosDeAulas");

    
    const dadosDaAula = {
      disciplina: disciplina,    // Ex: "Matemática"
      diaDaSemana: dia,          // Ex: "Segunda-feira"
      horaInicio: horaInicio,    // Ex: "08:00" (Pode ser string, ou um objeto Date mais complexo)
      local: local,              // Ex: "Sala 101"
      // Você pode adicionar outros campos, como professor, duração, etc.
      criadoEm: new Date()       // Adiciona um timestamp de quando foi criado
    };

    // Adicionar o documento à coleção
    // addDoc cria um documento com um ID único gerado automaticamente
    const novoDocumentoRef = await addDoc(colecaoDeHorarios, dadosDaAula);

    console.log("Informação de aula adicionada com sucesso! Documento ID: ", novoDocumentoRef.id);
    console.log("Dados adicionados:", dadosDaAula);

  } catch (e) {
    console.error("Erro ao adicionar informação de aula: ", e);
    // Este erro pode ser um problema de rede, configuração ou, mais comum para iniciantes,
    // um erro de permissão devido às regras de segurança do Firestore.
    if (e.code === 'permission-denied') {
        console.error("Permissão negada! Verifique suas regras de segurança do Firestore.");
    }
  }
}

// 6. Chamar a função para adicionar algumas informações de aula de exemplo
// Em uma aplicação real, você obteria esses dados de um formulário, etc.
console.log("Tentando adicionar horários de aulas ao Firestore...");

adicionarHorarioDeAula("portugues", "segunda", "10:30", "Sala 205");
adicionarHorarioDeAula("fisica", "terça", "14:00", "Laboratório 1");
// Você pode chamar a função várias vezes para adicionar mais aulas
console.log("Tentando adicionar uma mensagem ao Firestore...");

