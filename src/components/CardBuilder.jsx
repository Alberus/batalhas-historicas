import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './CardBuilder.css';

const CardBuilder = () => {
  const [cardData, setCardData] = useState({
    name: '',
    manutencao: '1',
    comb: '',
    hp: '',
    inf: '',
    capital: '',
    prod: '',
    renda: '',
    flavorText: '',
    description: '',
    desafio: '',
    aluno: '',
    set: 'Primeiro Reinado',
    imageUrl: ''
  });

  const cardRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

     const generatePDF = async () => {
     if (!cardRef.current) {
       alert('Erro: Elemento do card não encontrado. Tente recarregar a página.');
       return;
     }
     
     // Verificar se o card tem conteúdo
     if (!cardData.name.trim()) {
       alert('Por favor, preencha pelo menos o nome do card antes de gerar o PDF.');
       return;
     }
     
     // Mostrar indicador de progresso
     const btn = document.querySelector('.generate-btn');
     const originalText = btn.textContent;
     btn.textContent = 'Gerando PDF...';
     btn.disabled = true;

         try {
       // Verificar dimensões do preview para debug
       console.log('Preview dimensions:', cardRef.current.offsetWidth, cardRef.current.offsetHeight);
       
       const canvas = await html2canvas(cardRef.current, {
         scale: 3, // Aumentar para melhor qualidade
         backgroundColor: '#ffffff', // Fundo branco para impressão
         useCORS: true,
         allowTaint: true,
         logging: false,
         width: cardRef.current.offsetWidth,
         height: cardRef.current.offsetHeight
       });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
                           const imgWidth = 63; // MTG card width in mm
       const imgHeight = 128; // MTG card height in mm (igual ao preview)
       const pageWidth = pdf.internal.pageSize.getWidth();
       const pageHeight = pdf.internal.pageSize.getHeight();
       
       // Verificar dimensões do PDF para debug
       console.log('PDF dimensions:', imgWidth, 'x', imgHeight, 'mm');
       console.log('Page dimensions:', pageWidth, 'x', pageHeight, 'mm');
       
       const x = (pageWidth - imgWidth) / 2;
       const y = (pageHeight - imgHeight) / 2;
      
             pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
       pdf.save(`mtg-card-${cardData.name || 'unnamed'}.pdf`);
       
       // Sucesso - restaurar botão
       btn.textContent = originalText;
       btn.disabled = false;
     } catch (error) {
       console.error('Erro ao gerar PDF:', error);
       console.error('Detalhes do erro:', {
         message: error.message,
         stack: error.stack
       });
       alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
       
       // Erro - restaurar botão
       btn.textContent = originalText;
       btn.disabled = false;
     }
  };



  return (
    <div className="card-builder">
             <h1>Construtor de Cards - Batalhas Históricas</h1>
      
      <div className="builder-container">
        <div className="form-section">
          <h2>Informações Básicas</h2>
          
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={cardData.name}
              onChange={handleInputChange}
              placeholder="Nome ou tipo"
            />
          </div>

          <div className="form-group">
            <label>Manutenção:</label>
            <select
              name="manutencao"
              value={cardData.manutencao}
              onChange={handleInputChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="form-group stats-row">
            <div className="stat-field">
              <label>Comb.:</label>
              <input
                type="number"
                name="comb"
                value={cardData.comb}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="stat-field">
              <label>HP:</label>
              <input
                type="number"
                name="hp"
                value={cardData.hp}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="stat-field">
              <label>Inf.:</label>
              <input
                type="number"
                name="inf"
                value={cardData.inf}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group stats-row">
            <div className="stat-field">
              <label>Capital:</label>
              <input
                type="number"
                name="capital"
                value={cardData.capital}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="stat-field">
              <label>Prod.:</label>
              <input
                type="number"
                name="prod"
                value={cardData.prod}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="stat-field">
              <label>Renda:</label>
              <input
                type="number"
                name="renda"
                value={cardData.renda}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ações:</label>
            <textarea
              name="description"
              value={cardData.description}
              onChange={handleInputChange}
              placeholder="Descrição das ações do card"
              rows="1"
            />
          </div>

          <button className="generate-btn" onClick={generatePDF}>
            Gerar PDF
          </button>
        </div>

        <div className="form-section">
          <h2>Detalhes Adicionais</h2>

          <div className="form-group">
            <label>Desafio:</label>
            <textarea
              name="desafio"
              value={cardData.desafio}
              onChange={handleInputChange}
              placeholder="Descrição do desafio do card"
              rows="1"
            />
          </div>

          <div className="form-group">
            <label>Citação:</label>
            <textarea
              name="flavorText"
              value={cardData.flavorText}
              onChange={handleInputChange}
              placeholder="Citação (opcional)"
              rows="1"
            />
          </div>

          <div className="form-group">
            <label>Aluno:</label>
            <input
              type="text"
              name="aluno"
              value={cardData.aluno}
              onChange={handleInputChange}
              placeholder="Nome do aluno"
            />
          </div>

          <div className="form-group">
            <label>Set:</label>
            <input
              type="text"
              name="set"
              value={cardData.set}
              onChange={handleInputChange}
              placeholder="Nome do set"
            />
          </div>

          <div className="form-group">
            <label>Imagem do Card:</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setCardData(prev => ({
                      ...prev,
                      imageUrl: event.target.result
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        <div className="preview-section">
          <h2>Preview do Card</h2>
          <div className="card-preview" ref={cardRef}>
            <div className="mtg-card">
                             <div className="card-header">
                 <div className="card-name">{cardData.name || 'Nome do Card'}</div>
                 <div className="mana-cost">{cardData.manutencao || '1'}</div>
               </div>
              
                             <div className="card-art">
                 {cardData.imageUrl ? (
                   <img 
                     src={cardData.imageUrl} 
                     alt="Card Art" 
                     style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                   />
                 ) : (
                   <div className="art-placeholder">
                     {cardData.name ? '🎨' : 'Clique para adicionar arte'}
                   </div>
                 )}
               </div>
              
                             <div className="card-stats">
                 <span className="stat">Comb: {cardData.comb || '0'}</span>
                 <span className="stat">HP: {cardData.hp || '0'}</span>
                 <span className="stat">Inf: {cardData.inf || '0'}</span>
               </div>
               
               <div className="card-stats">
                 <span className="stat">Capital: {cardData.capital || '0'}</span>
                 <span className="stat">Prod: {cardData.prod || '0'}</span>
                 <span className="stat">Renda: {cardData.renda || '0'}</span>
               </div>
              
                             <div className="card-actions">
                 <h4>Ações</h4>
                 <div className="actions-content">
                   {cardData.description || 'Ações do card aparecerão aqui...'}
                 </div>
               </div>
               
               <div className="card-challenge">
                 <h4>Desafio</h4>
                 <div className="challenge-content">
                   {cardData.desafio || 'Desafio do card aparecerá aqui...'}
                 </div>
               </div>
              
                             <div className="card-quote">
                 <div className="quote-content">
                   {cardData.flavorText || 'Citação do card aparecerá aqui...'}
                 </div>
               </div>
              
                             <div className="card-footer">
                 <div className="card-info">
                   <div className="set-info">
                     {cardData.set && `${cardData.set} • ${cardData.aluno}`}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBuilder;
