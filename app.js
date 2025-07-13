const gorevForm = document.getElementById('gorevForm');
const gorevListesi = document.getElementById('gorevListesi');
const tamamlananlariGoster = document.getElementById('tamamlananlariGoster');
const siralama = document.getElementById('siralama');

let gorevler = [];

gorevForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const baslik = document.getElementById('baslik').value;
        const aciklama = document.getElementById('aciklama').value;
        const oncelik = document.querySelector('input[name="oncelik"]:checked')?.value;
        
        if (!baslik.trim()) {
            throw new Error('Başlık alanı boş olamaz!');
        }
        
        if (!oncelik) {
            throw new Error('Lütfen bir öncelik seçin!');
        }
        
        const yeniGorev = {
            id: Date.now(),
            baslik,
            aciklama,
            oncelik,
            tamamlandi: false
        };
        
        gorevler.push(yeniGorev);
        
        gorevleriGoster();
        
        gorevForm.reset();
        
        const hataMesaji = document.querySelector('.hata');
        if (hataMesaji) hataMesaji.remove();
        
    } catch (error) {
        const hataMesaji = document.createElement('div');
        hataMesaji.className = 'hata';
        hataMesaji.textContent = error.message;
        gorevForm.appendChild(hataMesaji);
    }
});

function gorevleriGoster(filtreliGorevler = null) {
    const gosterilecekGorevler = filtreliGorevler || gorevler;
    
    gorevListesi.innerHTML = '';
    
    gosterilecekGorevler.forEach(gorev => {
        const gorevDiv = document.createElement('div');
        gorevDiv.className = `gorev-item ${gorev.tamamlandi ? 'tamamlandi' : ''}`;
        
        gorevDiv.innerHTML = `
            <div>
                <h3>${gorev.baslik}</h3>
                ${gorev.aciklama ? `<p>${gorev.aciklama}</p>` : ''}
                <small>Öncelik: ${gorev.oncelik}</small>
            </div>
            <div class="gorev-buttons">
                <button onclick="goreviTamamla(${gorev.id})" class="tamamla-btn">
                    ${gorev.tamamlandi ? 'Geri Al' : 'Tamamla'}
                </button>
                <button onclick="goreviSil(${gorev.id})" class="sil-btn">Sil</button>
            </div>
        `;
        
        gorevListesi.appendChild(gorevDiv);
    });
}

function goreviTamamla(id) {
    const gorev = gorevler.find(g => g.id === id);
    if (gorev) {
        gorev.tamamlandi = !gorev.tamamlandi;
        gorevleriGoster();
    }
}

function goreviSil(id) {
    gorevler = gorevler.filter(g => g.id !== id);
    gorevleriGoster();
}

let sadeceTamamlananlar = false;
tamamlananlariGoster.addEventListener('click', function() {
    sadeceTamamlananlar = !sadeceTamamlananlar;
    this.textContent = sadeceTamamlananlar ? 'Tümünü Göster' : 'Sadece Tamamlananları Göster';
    
    if (sadeceTamamlananlar) {
        const tamamlananGorevler = gorevler.filter(g => g.tamamlandi);
        gorevleriGoster(tamamlananGorevler);
    } else {
        gorevleriGoster();
    }
});

siralama.addEventListener('change', function() {
    const siralamaTuru = this.value;
    
    if (siralamaTuru) {
        const siraliGorevler = [...gorevler].sort((a, b) => {
            const oncelikSirasi = {
                'düşük': 1,
                'orta': 2,
                'yüksek': 3
            };
            
            return siralamaTuru === 'dusuk' 
                ? oncelikSirasi[a.oncelik] - oncelikSirasi[b.oncelik]
                : oncelikSirasi[b.oncelik] - oncelikSirasi[a.oncelik];
        });
        
        gorevleriGoster(siraliGorevler);
    } else {
        gorevleriGoster();
    }
}); 
