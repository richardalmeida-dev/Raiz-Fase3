// =====================================================================
// Raiz · protótipo das telas (FIAP · PBL Fase 3)
// Tudo aqui usa o que vimos nas aulas: variáveis, objetos, arrays,
// funções, if/else, for, objeto Date e acesso a elementos (DOM).
// Os dados ficam em arrays na memória: ao recarregar a página, o
// protótipo volta ao começo (não há banco de dados nesta fase).
// =====================================================================

// ---------- 1. Dados do protótipo ----------

// Produtos que o produtor pode aplicar e quantos dias de carência cada um tem.
// Carência = dias que precisa esperar depois da aplicação para poder colher.
const produtos = [
  { nome: 'Calda bordalesa', carencia: 3 },
  { nome: 'Adubo orgânico', carencia: 0 },
  { nome: 'Óleo de neem', carencia: 0 },
  { nome: 'Calcário', carencia: 0 }
]

const talhoes = [
  { id: 1, nome: 'Talhão 1', cultura: 'Tomate', area: '0,5 hectare' },
  { id: 2, nome: 'Talhão 2', cultura: 'Alface', area: '0,3 hectare' }
]

// Registros iniciais com datas contadas a partir de hoje,
// para o exemplo de carência funcionar em qualquer dia que abrir a página.
const registros = [
  { talhao: 1, produto: 'Calda bordalesa', quantidade: 5, unidade: 'litros', carencia: 3, data: diasAtras(1), receituario: 'Rec. 2026-118' },
  { talhao: 1, produto: 'Adubo orgânico', quantidade: 40, unidade: 'kg', carencia: 0, data: diasAtras(12), receituario: '' },
  { talhao: 2, produto: 'Adubo orgânico', quantidade: 30, unidade: 'kg', carencia: 0, data: diasAtras(12), receituario: '' }
]

const lotes = []
lotes.push({ codigo: gerarCodigo(diasAtras(2), 1), talhao: 2, caixas: 120, data: diasAtras(2) })

// ---------- 2. Funções de data (objeto Date) ----------

// Data de hoje sem as horas, para comparar só o dia.
function hoje() {
  const agora = new Date()
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
}

function somarDias(data, dias) {
  const nova = new Date(data.getFullYear(), data.getMonth(), data.getDate())
  nova.setDate(nova.getDate() + dias)
  return nova
}

function diasAtras(dias) {
  return somarDias(hoje(), -dias)
}

// Coloca zero à esquerda: 5 vira "05".
function doisDigitos(numero) {
  if (numero < 10) {
    return '0' + numero
  }
  return '' + numero
}

// Quantidade no formato brasileiro: 12.5 vira "12,5 kg" (replace do objeto String).
function formatarQuantidade(registro) {
  return String(registro.quantidade).replace('.', ',') + ' ' + registro.unidade
}

// Data no formato brasileiro: 22/09/2026
function formatarData(data) {
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`
}

// Data no formato que o <input type="date"> usa: 2026-09-22
function dataParaInput(data) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
}

// Converte o valor do <input type="date"> ("2026-09-22") em Date.
function lerDataDoInput(valor) {
  const partes = valor.split('-')
  return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
}

// Código do lote: ano-mêsdia-número do lote. Ex.: 2026-0922-01
function gerarCodigo(data, numero) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}${doisDigitos(data.getDate())}-${doisDigitos(numero)}`
}

// ---------- 3. Regras do caderno de campo ----------

function buscarTalhao(id) {
  for (let i = 0; i < talhoes.length; i++) {
    if (talhoes[i].id === id) {
      return talhoes[i]
    }
  }
  return null
}

function buscarProduto(nome) {
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].nome === nome) {
      return produtos[i]
    }
  }
  return null
}

// Dia em que o talhão fica liberado: a maior data entre (aplicação + carência).
// Se nenhum produto com carência foi aplicado, devolve null.
function dataDeLiberacao(talhaoId) {
  let libera = null
  for (let i = 0; i < registros.length; i++) {
    const r = registros[i]
    if (r.talhao === talhaoId && r.carencia > 0) {
      const fim = somarDias(r.data, r.carencia)
      if (libera === null || fim > libera) {
        libera = fim
      }
    }
  }
  return libera
}

// Quantos dias faltam para poder colher (0 = já pode).
function diasParaColher(talhaoId) {
  const libera = dataDeLiberacao(talhaoId)
  if (libera === null) {
    return 0
  }
  const umDia = 1000 * 60 * 60 * 24
  const dias = Math.ceil((libera.getTime() - hoje().getTime()) / umDia)
  if (dias > 0) {
    return dias
  }
  return 0
}

// Registros do talhão, do mais novo para o mais antigo.
function registrosDoTalhao(talhaoId) {
  const lista = registros.filter((r) => r.talhao === talhaoId)
  lista.sort((a, b) => b.data - a.data)
  return lista
}

// ---------- 4. Ajudantes para criar elementos na tela ----------

// Cria um elemento com classes e texto. innerText garante que o que a pessoa
// digitou aparece como texto e nunca vira HTML.
function criar(tag, classes, texto) {
  const elemento = document.createElement(tag)
  if (classes) {
    elemento.className = classes
  }
  if (texto !== undefined) {
    elemento.innerText = texto
  }
  return elemento
}

// Selo verde (liberado) ou laranja (em carência) usado em várias telas.
function criarSeloCarencia(talhaoId) {
  const dias = diasParaColher(talhaoId)
  if (dias === 0) {
    return criar('span', 'inline-flex items-center gap-1 rounded-full bg-sucesso-fundo px-3 py-1 text-sm font-semibold text-sucesso', 'Liberado para colher')
  }
  let texto = `Pode colher em ${dias} dias`
  if (dias === 1) {
    texto = 'Pode colher amanhã'
  }
  return criar('span', 'inline-flex items-center gap-1 rounded-full bg-atencao-fundo px-3 py-1 text-sm font-semibold text-atencao', texto)
}

// ---------- 5. Navegação entre as 5 seções ----------

function mostrarSecao(nome) {
  const secoes = document.querySelectorAll('.secao')
  for (let i = 0; i < secoes.length; i++) {
    secoes[i].classList.add('hidden')
  }
  document.getElementById('secao-' + nome).classList.remove('hidden')

  // Destaca no menu o botão da seção aberta.
  const botoesMenu = document.querySelectorAll('.botao-menu')
  for (let i = 0; i < botoesMenu.length; i++) {
    if (botoesMenu[i].getAttribute('data-secao') === nome) {
      botoesMenu[i].classList.add('text-raiz', 'md:bg-folha', 'dark:text-broto', 'dark:md:bg-noite-card')
      botoesMenu[i].setAttribute('aria-current', 'page')
    } else {
      botoesMenu[i].classList.remove('text-raiz', 'md:bg-folha', 'dark:text-broto', 'dark:md:bg-noite-card')
      botoesMenu[i].removeAttribute('aria-current')
    }
  }
  window.scrollTo(0, 0)
}

// Todo elemento com data-secao (menu, logo e atalhos) abre a seção indicada.
const linksDeSecao = document.querySelectorAll('[data-secao]')
for (let i = 0; i < linksDeSecao.length; i++) {
  linksDeSecao[i].addEventListener('click', () => {
    mostrarSecao(linksDeSecao[i].getAttribute('data-secao'))
  })
}

// ---------- 6. Tela Início ----------

function atualizarInicio() {
  document.getElementById('total-registros').innerText = registros.length
  document.getElementById('total-lotes').innerText = lotes.length

  let emCarencia = 0
  for (let i = 0; i < talhoes.length; i++) {
    if (diasParaColher(talhoes[i].id) > 0) {
      emCarencia++
    }
  }
  document.getElementById('total-carencia').innerText = emCarencia

  // Cartões dos talhões
  const areaTalhoes = document.getElementById('inicio-talhoes')
  areaTalhoes.innerHTML = ''
  for (let i = 0; i < talhoes.length; i++) {
    const t = talhoes[i]
    const cartao = criar('button', 'flex flex-col items-start gap-2 rounded-2xl border border-borda bg-white p-4 text-left duration-300 hover:border-raiz dark:border-noite-borda dark:bg-noite-card')
    cartao.type = 'button'
    cartao.append(criar('strong', 'text-lg', `${t.nome} · ${t.cultura}`))
    cartao.append(criarSeloCarencia(t.id))
    cartao.addEventListener('click', () => mostrarSecao('talhoes'))
    areaTalhoes.append(cartao)
  }

  // Últimos 3 registros (o array é copiado com slice para não mudar a ordem original)
  const lista = document.getElementById('inicio-ultimos')
  lista.innerHTML = ''
  const ordenados = registros.slice().sort((a, b) => b.data - a.data)
  for (let i = 0; i < ordenados.length && i < 3; i++) {
    const r = ordenados[i]
    const item = criar('li', 'flex items-center justify-between gap-3 py-3')
    const texto = criar('span')
    texto.append(criar('strong', 'block', r.produto))
    texto.append(criar('span', 'text-sm text-texto-2 dark:text-slate-300', `${buscarTalhao(r.talhao).nome} · ${formatarQuantidade(r)}`))
    item.append(texto)
    item.append(criar('span', 'text-sm text-texto-2 dark:text-slate-300', formatarData(r.data)))
    lista.append(item)
  }
}

// ---------- 7. Tela Registrar aplicação ----------

const formRegistro = document.getElementById('form-registro')
const campoProduto = document.getElementById('produto')
const campoTalhao = document.getElementById('talhao')
const campoData = document.getElementById('data-aplicacao')
const mensagemRegistro = document.getElementById('registro-mensagem')

// Preenche as listas de produtos e talhões a partir dos arrays.
for (let i = 0; i < produtos.length; i++) {
  const opcao = criar('option', '', produtos[i].nome)
  opcao.value = produtos[i].nome
  campoProduto.append(opcao)
}
for (let i = 0; i < talhoes.length; i++) {
  const opcao = criar('option', '', `${talhoes[i].nome} · ${talhoes[i].cultura}`)
  opcao.value = talhoes[i].id
  campoTalhao.append(opcao)
}

// A data começa em hoje e não aceita datas no futuro (atributo max do HTML5).
campoData.value = dataParaInput(hoje())
campoData.max = dataParaInput(hoje())

// Registro por voz (simulado): preenche o formulário com a frase de exemplo.
document.getElementById('btn-voz').addEventListener('click', () => {
  campoProduto.value = 'Calda bordalesa'
  document.getElementById('quantidade').value = 5
  document.getElementById('unidade').value = 'litros'
  campoTalhao.value = 1
  campoData.value = dataParaInput(hoje())
  document.getElementById('receituario').value = 'Rec. 2026-118'
  document.getElementById('voz-status').innerText = 'Entendi: calda bordalesa, 5 litros, talhão 1, hoje. Confira o formulário e toque em Salvar registro.'
})

formRegistro.addEventListener('submit', (evento) => {
  // O navegador só chega aqui se os campos passaram na validação do HTML5.
  evento.preventDefault()

  const produto = buscarProduto(campoProduto.value)
  const talhao = buscarTalhao(Number(campoTalhao.value))
  const novo = {
    talhao: talhao.id,
    produto: produto.nome,
    quantidade: Number(document.getElementById('quantidade').value),
    unidade: document.getElementById('unidade').value,
    carencia: produto.carencia,
    data: lerDataDoInput(campoData.value),
    receituario: document.getElementById('receituario').value.trim()
  }
  registros.push(novo)

  let texto = `Registro salvo: ${novo.produto} no ${talhao.nome}.`
  if (novo.carencia > 0) {
    texto += ` Carência de ${novo.carencia} dias: pode colher a partir de ${formatarData(somarDias(novo.data, novo.carencia))}.`
  } else {
    texto += ' Produto sem carência.'
  }
  mensagemRegistro.innerText = texto
  mensagemRegistro.classList.remove('hidden')

  formRegistro.reset()
  campoData.value = dataParaInput(hoje())
  document.getElementById('voz-status').innerText = 'Exemplo: "Apliquei cinco litros de calda bordalesa no talhão um, hoje."'
  atualizarTudo()
})

// ---------- 8. Tela Talhões e lotes ----------

function atualizarTalhoes() {
  const area = document.getElementById('lista-talhoes')
  area.innerHTML = ''
  for (let i = 0; i < talhoes.length; i++) {
    const t = talhoes[i]
    const cartao = criar('article', 'rounded-2xl border border-borda bg-white p-6 dark:border-noite-borda dark:bg-noite-card')
    cartao.append(criar('h3', 'text-2xl font-extrabold', `${t.nome} · ${t.cultura}`))
    cartao.append(criar('p', 'mb-3 text-texto-2 dark:text-slate-300', t.area))
    cartao.append(criarSeloCarencia(t.id))

    cartao.append(criar('h4', 'mt-5 mb-2 font-bold', 'O que foi feito aqui'))
    const lista = criar('ul', 'flex flex-col gap-3 border-l-2 border-borda pl-4 dark:border-noite-borda')
    const doTalhao = registrosDoTalhao(t.id)
    for (let j = 0; j < doTalhao.length; j++) {
      const r = doTalhao[j]
      const item = criar('li')
      item.append(criar('span', 'block text-sm font-semibold text-texto-2 dark:text-slate-300', formatarData(r.data)))
      item.append(criar('strong', 'block', r.produto))
      let detalhe = formatarQuantidade(r)
      if (r.carencia > 0) {
        detalhe += ` · carência de ${r.carencia} dias`
      }
      item.append(criar('span', 'text-sm', detalhe))
      lista.append(item)
    }
    cartao.append(lista)
    area.append(cartao)
  }

  // Lista de talhões da colheita: talhão em carência aparece bloqueado.
  const campoColheita = document.getElementById('colheita-talhao')
  const selecionado = campoColheita.value
  campoColheita.innerHTML = ''
  for (let i = 0; i < talhoes.length; i++) {
    const t = talhoes[i]
    const opcao = criar('option', '', `${t.nome} · ${t.cultura}`)
    opcao.value = t.id
    if (diasParaColher(t.id) > 0) {
      opcao.innerText += ' (em carência)'
      opcao.disabled = true
    }
    campoColheita.append(opcao)
  }
  // Mantém a escolha anterior se ela ainda puder ser colhida; senão, o primeiro liberado.
  campoColheita.value = selecionado
  const opcaoAtual = campoColheita.options[campoColheita.selectedIndex]
  if (opcaoAtual === undefined || opcaoAtual.disabled) {
    for (let i = 0; i < campoColheita.options.length; i++) {
      if (!campoColheita.options[i].disabled) {
        campoColheita.value = campoColheita.options[i].value
        break
      }
    }
  }

  // Relatório: todos os registros, do mais novo para o mais antigo.
  const tabela = document.getElementById('tabela-registros')
  tabela.innerHTML = ''
  const ordenados = registros.slice().sort((a, b) => b.data - a.data)
  for (let i = 0; i < ordenados.length; i++) {
    const r = ordenados[i]
    const linha = criar('tr')
    linha.append(criar('td', 'py-2 pr-3', formatarData(r.data)))
    linha.append(criar('td', 'py-2 pr-3', buscarTalhao(r.talhao).nome))
    linha.append(criar('td', 'py-2 pr-3', r.produto))
    linha.append(criar('td', 'py-2 pr-3', `${formatarQuantidade(r)}`))
    linha.append(criar('td', 'py-2', r.receituario || 'Não exige'))
    tabela.append(linha)
  }
}

const formColheita = document.getElementById('form-colheita')
const campoDataColheita = document.getElementById('data-colheita')
campoDataColheita.value = dataParaInput(hoje())
campoDataColheita.max = dataParaInput(hoje())
let ultimoLote = null

formColheita.addEventListener('submit', (evento) => {
  evento.preventDefault()
  const talhao = buscarTalhao(Number(document.getElementById('colheita-talhao').value))

  // Segurança alimentar: não deixa gerar lote de talhão em carência.
  const dias = diasParaColher(talhao.id)
  if (dias > 0) {
    alert(`O ${talhao.nome} está em carência. Pode colher em ${dias} dias.`)
    return
  }

  const data = lerDataDoInput(campoDataColheita.value)
  const caixas = Number(document.getElementById('caixas').value)
  const lote = { codigo: gerarCodigo(data, lotes.length + 1), talhao: talhao.id, caixas: caixas, data: data }
  lotes.push(lote)
  ultimoLote = lote

  document.getElementById('etiqueta-codigo').innerText = 'LOTE ' + lote.codigo
  document.getElementById('etiqueta-descricao').innerText = `${talhao.cultura} · ${caixas} caixas · ${formatarData(data)}`
  document.getElementById('etiqueta-vazia').classList.add('hidden')
  document.getElementById('etiqueta').classList.remove('hidden')
  atualizarTudo()
})

// Da etiqueta, vai direto para a procedência do lote que acabou de ser criado.
document.getElementById('btn-ver-procedencia').addEventListener('click', () => {
  document.getElementById('select-lote').value = ultimoLote.codigo
  mostrarProcedencia()
  mostrarSecao('procedencia')
})

// ---------- 9. Tela Procedência ----------

const selectLote = document.getElementById('select-lote')

function atualizarListaDeLotes() {
  const selecionado = selectLote.value
  selectLote.innerHTML = ''
  for (let i = lotes.length - 1; i >= 0; i--) {
    const l = lotes[i]
    const opcao = criar('option', '', `Lote ${l.codigo} · ${buscarTalhao(l.talhao).cultura}`)
    opcao.value = l.codigo
    selectLote.append(opcao)
  }
  if (selecionado !== '') {
    selectLote.value = selecionado
  }
}

function mostrarProcedencia() {
  let lote = null
  for (let i = 0; i < lotes.length; i++) {
    if (lotes[i].codigo === selectLote.value) {
      lote = lotes[i]
    }
  }
  if (lote === null) {
    return
  }
  const talhao = buscarTalhao(lote.talhao)
  document.getElementById('proc-titulo').innerText = `${talhao.cultura} do Sítio Boa Esperança`
  document.getElementById('proc-subtitulo').innerText = `Colhido em ${formatarData(lote.data)} · Lote ${lote.codigo}`
  document.getElementById('proc-talhao').innerText = `${talhao.nome} · ${lote.caixas} caixas`
  document.getElementById('proc-codigo').innerText = 'LOTE ' + lote.codigo

  // Mostra só o que foi aplicado até o dia da colheita.
  const lista = document.getElementById('proc-historico')
  lista.innerHTML = ''
  const doTalhao = registrosDoTalhao(talhao.id)
  let teveCarencia = false
  for (let i = 0; i < doTalhao.length; i++) {
    const r = doTalhao[i]
    if (r.data <= lote.data) {
      const item = criar('li', 'border-l-4 border-raiz pl-4')
      item.append(criar('span', 'block text-sm font-semibold text-texto-2 dark:text-slate-300', formatarData(r.data)))
      item.append(criar('strong', 'block', r.produto))
      item.append(criar('span', 'text-sm', `${formatarQuantidade(r)}`))
      lista.append(item)
      if (r.carencia > 0) {
        teveCarencia = true
      }
    }
  }

  let selo = 'Nenhum produto com carência aplicado'
  if (teveCarencia) {
    selo = 'Carência respeitada: colhido depois do prazo'
  }
  document.getElementById('proc-selo').innerText = selo
}

selectLote.addEventListener('change', mostrarProcedencia)

// ---------- 10. Tela Fale Conosco ----------

const formContato = document.getElementById('form-contato')
formContato.addEventListener('submit', (evento) => {
  // A validação já foi feita pelo HTML5 (required, type="email", pattern...).
  // Aqui só mostramos a confirmação, porque o protótipo não envia nada.
  evento.preventDefault()
  const nome = document.getElementById('nome').value.trim().split(' ')[0]
  const sucesso = document.getElementById('contato-sucesso')
  sucesso.innerText = `Obrigado, ${nome}! Sua mensagem foi validada. Neste protótipo ela não é enviada.`
  sucesso.classList.remove('hidden')
  formContato.reset()
})

// ---------- 11. Modo escuro (igual ao exemplo da apostila) ----------

const htmlElement = document.querySelector('html')
document.getElementById('btn-tema').addEventListener('click', () => {
  htmlElement.classList.toggle('dark')
})

// ---------- 12. Início ----------

function atualizarTudo() {
  atualizarInicio()
  atualizarTalhoes()
  atualizarListaDeLotes()
  mostrarProcedencia()
}

const diasDaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
document.getElementById('data-hoje').innerText = `${diasDaSemana[hoje().getDay()]}, ${formatarData(hoje())}`

atualizarTudo()
mostrarSecao('inicio')
