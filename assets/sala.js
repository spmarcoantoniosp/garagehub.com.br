/* =========================================================================
   Sala de entrada — Garage Hub · motor compartilhado
   A página que carrega este arquivo define window.TRILHA antes:
     'bate'     → bate-papo, 6 telas, sem pontuação
     'briefing' → briefing prévio completo, com pontuação e linha para a ficha
   Sem bifurcação: cada trilha tem link próprio, enviado por convite.
   ========================================================================= */

/* ---------- configuração: preencher antes de publicar --------------------- */
var ENVIO = {
  url: 'https://api.web3forms.com/submit',
  chave: 'de7403d5-56b8-4269-b8b2-5ee478df2ab2',
  destino: 'facilitadores@garagecriativa.com.br'
};

var trilha = window.TRILHA;
var GUARDA = 'garage_sala_' + trilha;
var PULAR  = '__PULOU__';

/* ---------- listas -------------------------------------------------------- */
var SETORES=['Indústria e manufatura','Agronegócio e produção rural','Frigorífico e proteína animal',
'Alimentos e bebidas','Construção e incorporação','Varejo e e-commerce','Saúde e operadoras',
'Seguros e previdência','Serviços financeiros e crédito','Logística e transporte','Educação',
'Tecnologia e software','Serviços profissionais','Energia e utilities','Outro'];
var UFS=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI',
'RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
var PESSOAS=['Menos de 30','De 30 a 99','De 100 a 299','De 300 a 999','1.000 ou mais','Não sei informar'];
var ROB=['Até 4,8 milhões','De 4,8 a 15 milhões','De 15 a 40 milhões','De 40 a 60 milhões',
'De 60 a 80 milhões','De 80 a 150 milhões','Acima de 150 milhões','Prefiro não informar'];
var REGIME=['Simples Nacional ou MEI','Lucro Presumido','Lucro Real','Não sei informar'];
var UNID=['1 (só a matriz)','2 ou 3','De 4 a 9','10 ou mais'];
var ESTADOS=['1','2','3 ou mais'];
var GRUPO=['1','2','De 3 a 5','6 ou mais','Não sei'];
var ERP=['Planilhas ou sistema próprio','ERP básico ou do setor','ERP corporativo',
'ERP corporativo com integrações, ou troca em andamento','Não sei informar'];
var TI=['Não temos','TI terceirizada','TI interna','TI interna com alguém dedicado a dados ou BI'];
var COMANDO=['Fundador, sem sucessão definida','Fundador, com sucessão em discussão',
'Segunda geração, parcialmente','Segunda ou terceira geração, ou CEO de fora da família','Prefiro não informar'];
var JANELA=['Estamos no ciclo orçamentário agora','Nos próximos 3 a 6 meses','Daqui a mais de 6 meses','Não temos ciclo definido'];
var CONSULT=['Nunca contratamos, e há resistência interna','Nunca contratamos','Já contratamos pontualmente',
'Contratamos com recorrência','Temos fornecedor atual, mas não estamos satisfeitos'];
var DECISOR=['Eu decido','Meu gestor','Comitê ou diretoria','Matriz ou grupo','Não sei'];
var GATOP=['Troca ou implantação de ERP','Vaga aberta em processos, PMO, BI ou dados',
'Crescimento rápido do time','Mudança relevante na operação','Auditoria ou exigência regulatória nova','Nenhum desses'];
var GATEST=['Entrada de sócio, fundo ou investidor','Aquisição ou fusão','Sucessão formalizada',
'Sucessão em curso','Conselho consultivo instalado','Expansão anunciada','Nenhum desses'];
var VAZAMENTO=['Retrabalho e erro','Processos manuais e planilha','Decisão sem dado','Atrito e perda de cliente',
'Compras e estoque','Ociosidade de equipe ou ativo','Inadimplência','Custo de TI e licenças','Não sei dizer'];

/* ---------- estado -------------------------------------------------------- */
var R={}, i=0, enviando=false;
function pn(){ return (R.nome||'').trim().split(' ')[0] || 'você'; }
function emp(){ return (R.empresa||'').trim() || 'sua empresa'; }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function txt(v){ return typeof v==='function'?v():v; }

/* =========================================================================
   PERGUNTAS
   tr: 'ambos' entra nas duas trilhas · 'briefing' só no completo
   ========================================================================= */
var Q=[
{id:'g_pessoa',tr:'ambos',b:'Contato',t:'Vamos começar por você',tipo:'grupo',subs:[
  {id:'nome',lab:'Seu nome completo',tipo:'texto',ph:'Nome e sobrenome',req:true},
  {id:'cargo',lab:'Cargo ou função',tipo:'texto',ph:'Ex.: Diretor de Operações',req:true}]},

{id:'g_contato',tr:'ambos',b:'Contato',t:function(){return pn()+', como falo com você?'},tipo:'grupo',subs:[
  {id:'email',lab:'E-mail corporativo',tipo:'email',ph:'nome@empresa.com.br',req:true},
  {id:'whats',lab:'WhatsApp <i>— é por aqui que combino o horário</i>',tipo:'tel',ph:'(11) 90000-0000',req:true}]},

{id:'g_emp',tr:'briefing',b:'Empresa',t:'Sobre a empresa',tipo:'grupo',subs:[
  {id:'empresa',lab:'Nome da empresa',tipo:'texto',ph:'Nome fantasia já basta',req:true},
  {id:'cnpj',lab:'CNPJ <i>— opcional, mas é o que me permite chegar na conversa conhecendo o contexto</i>',tipo:'texto',ph:'00.000.000/0000-00'}]},

{id:'empresa_so',tr:'bate',b:'Empresa',t:'Qual é a empresa?',tipo:'texto',req:true,ph:'Nome fantasia já basta',
  alvo:'empresa'},

{id:'setor',tr:'ambos',b:'Empresa',t:function(){return 'Em que a '+emp()+' atua?'},tipo:'select',ops:SETORES,req:true},

/* aparece sempre no completo; no bate-papo, só quando o setor for Outro */
{id:'subsetor',tr:'ambos',b:'Empresa',t:'Em uma linha, o que a empresa faz',tipo:'texto',
  ph:'Ex.: abate e industrialização de bovinos',
  se:function(){ return trilha==='briefing' || R.setor==='Outro'; },
  req:function(){ return R.setor==='Outro'; }},

{id:'g_local',tr:'briefing',b:'Empresa',t:'Onde fica a sede?',tipo:'grupo',subs:[
  {id:'mun',lab:'Município',tipo:'texto',ph:'Ex.: Suzano',req:true},
  {id:'uf',lab:'Estado',tipo:'select',ops:UFS,req:true}]},

{id:'vazamento',tr:'ambos',b:'Desafio',t:function(){return 'Onde você suspeita que a '+emp()+' mais perde dinheiro hoje?'},
  h:'Escolha até duas. Se nenhuma servir, siga em frente — tem espaço para contar com suas palavras.',
  tipo:'multi',max:2,req:true,ops:VAZAMENTO},

{id:'g_porte',tr:'briefing',b:'Empresa',t:'Porte',
  h:'Faixa larga já resolve. Se preferir não informar, marque a última opção — vazio é melhor que chute.',tipo:'grupo',subs:[
  {id:'pessoas',lab:'Pessoas trabalhando na empresa',tipo:'chips',ops:PESSOAS,req:true},
  {id:'rob',lab:'Faturamento anual',tipo:'chips',ops:ROB,req:true}]},

{id:'g_estrut',tr:'briefing',b:'Estrutura',t:'Regime e formato',tipo:'grupo',subs:[
  {id:'regime',lab:'Regime tributário',tipo:'chips',ops:REGIME},
  {id:'modelo',lab:'Para quem vende',tipo:'chips',ops:['B2B','B2C','B2B2C','Governo','Misto']}]},

{id:'g_unid',tr:'briefing',b:'Estrutura',t:'Unidades e grupo',
  h:'Isso indica o quanto a operação é distribuída — e é onde a complexidade costuma nascer.',tipo:'grupo',subs:[
  {id:'unidades',lab:'Unidades, contando a matriz',tipo:'chips',ops:UNID},
  {id:'estados',lab:'Em quantos estados',tipo:'chips',ops:ESTADOS},
  {id:'grupocnpj',lab:'CNPJs do mesmo grupo',tipo:'chips',ops:GRUPO}]},

{id:'g_sist',tr:'briefing',b:'Estrutura',t:'Sistemas',tipo:'grupo',subs:[
  {id:'erp',lab:'Sistema de gestão',tipo:'chips',ops:ERP},
  {id:'ti',lab:'Estrutura de TI e dados',tipo:'chips',ops:TI}]},

{id:'comando',tr:'briefing',b:'Estrutura',t:'Quem está no comando hoje?',tipo:'unica',ops:COMANDO},

{id:'g_desafio',tr:'briefing',b:'Desafio',t:'Conte o desafio em três linhas',
  h:'Uma linha em cada. Frase curta serve — não precisa de texto bonito.',tipo:'grupo',escape:true,subs:[
  {id:'d_oque',lab:'O que acontece hoje',tipo:'texto',ph:'Ex.: o fechamento atrasa três dias todo mês'},
  {id:'d_quem',lab:'Quem sente isso',tipo:'texto',ph:'Ex.: o financeiro e a diretoria'},
  {id:'d_custo',lab:'Quanto isso custa por mês, mesmo que por alto',tipo:'texto',ph:'Em dinheiro, horas, clientes ou risco'}]},

{id:'dono',tr:'briefing',b:'Desafio',t:'Quem é o dono desse processo hoje?',
  h:'Área ou pessoa. Serve para eu saber com quem a conversa precisa acontecer.',
  tipo:'texto',escape:true,ph:'Ex.: a controladoria, com o Paulo à frente'},

{id:'idade',tr:'briefing',b:'Desafio',t:'Há quanto tempo isso acontece?',tipo:'unica',
  ops:['Menos de 6 meses','De 6 a 12 meses','De 1 a 3 anos','Mais de 3 anos','Sempre foi assim']},

{id:'tentativas',tr:'briefing',b:'Desafio',t:'O que já foi tentado e por que não resolveu?',
  h:'Serve para eu não repropor o que já falhou.',tipo:'longo',escape:true,ph:'Pode ser direto ao ponto.',
  se:function(){ return R.idade && R.idade!=='Menos de 6 meses'; }},

{id:'inacao',tr:'briefing',b:'Desafio',t:function(){return 'Se nada for feito na '+emp()+' nos próximos 12 meses, o que acontece?'},
  h:'Pode ser em número ou em consequência. Não precisa ser longo.',tipo:'longo',escape:true,
  ph:'Custo, risco, oportunidade perdida...'},

{id:'sucesso',tr:'briefing',b:'Desafio',t:function(){return 'Se isso for resolvido, o que passa a ser diferente no dia a dia da '+emp()+'?'},
  h:'É a pergunta que enquadra o trabalho inteiro. Uma frase basta.',tipo:'longo',escape:true,
  ph:'Ex.: o fechamento sai no dia 5 e ninguém vira a noite.'},

{id:'gatop',tr:'briefing',b:'Momento',t:'Está acontecendo algo assim na empresa nos últimos doze meses?',
  h:'Marque quantos servirem.',tipo:'multi',ops:GATOP},

{id:'gatest',tr:'briefing',b:'Momento',t:'E do lado societário ou de governança?',
  h:'Marque quantos servirem.',tipo:'multi',ops:GATEST},

{id:'g_janela',tr:'briefing',b:'Momento',t:'Como vocês decidem investimento',tipo:'grupo',subs:[
  {id:'janela',lab:'Ciclo de planejamento',tipo:'chips',ops:JANELA},
  {id:'consultoria',lab:'Experiência com consultoria',tipo:'chips',ops:CONSULT}]},

{id:'ate_onde',tr:'ambos',b:'Enquadramento',t:'Até onde você imagina ir agora?',
  h:'Não precisa acertar. É só para eu dimensionar a conversa no tamanho certo.',tipo:'unica',req:true,
  ops:['Entender o problema','Testar uma solução','Planejar a implementação','Executar a implementação','Ainda não sei']},

{id:'entregavel',tr:'briefing',b:'Enquadramento',t:'O que você espera ter em mãos ao final?',
  h:'Pode marcar mais de uma.',tipo:'multi',req:true,
  ops:['Diagnóstico','Protótipo validado','Plano de implementação','Time capacitado','Indicadores para acompanhar']},

{id:'budget',tr:'briefing',b:'Enquadramento',t:'Existe orçamento para isso?',
  h:'Resposta honesta aqui poupa tempo dos dois lados.',tipo:'unica',req:true,
  ops:['Aprovado','Em aprovação','Ainda é sondagem','Não sei informar']},

{id:'faixa',tr:'briefing',b:'Enquadramento',t:'Que faixa de investimento vocês consideram?',
  h:'Só para eu não propor algo fora de escala.',tipo:'unica',
  se:function(){ return R.budget==='Aprovado'||R.budget==='Em aprovação'; },
  opsDin:function(){
    var b;
    if(R.ate_onde==='Entender o problema') b=['Até 20 mil','De 20 a 35 mil','De 35 a 50 mil'];
    else if(R.ate_onde==='Testar uma solução') b=['De 20 a 35 mil','De 35 a 50 mil','De 50 a 90 mil'];
    else if(R.ate_onde==='Planejar a implementação'||R.ate_onde==='Executar a implementação')
      b=['De 50 a 90 mil','De 90 a 300 mil','Acima de 300 mil'];
    else b=['Até 20 mil','De 20 a 35 mil','De 35 a 50 mil','De 50 a 90 mil','De 90 a 300 mil','Acima de 300 mil'];
    return b.concat(['Ainda não temos referência','Prefiro não informar']); }},

{id:'decisor',tr:'briefing',b:'Enquadramento',t:'Quem decide a contratação?',tipo:'unica',req:true,ops:DECISOR},

{id:'trava',tr:'briefing',b:'Enquadramento',t:'Existe data ou evento que trava o prazo?',
  h:'Auditoria, exigência regulatória, fechamento de exercício.',tipo:'texto',
  ph:'Se não houver, deixe em branco',
  se:function(){ return R.budget==='Aprovado'||R.budget==='Em aprovação'; }},

{id:'inicio',tr:'briefing',b:'Enquadramento',t:'Quando gostaria de começar?',tipo:'unica',
  ops:['Neste mês','Em 1 a 3 meses','Em 4 a 6 meses','Depois de 6 meses','Sem data definida']},

{id:'maturidade',tr:'briefing',b:'Tecnologia',t:'Em que estágio vocês estão com inteligência artificial?',tipo:'unica',
  ops:['Não usamos','Uso individual, sem política da empresa','Pilotos isolados','Já usa em processo produtivo','IA integrada à operação'],
  se:function(){ return R.ate_onde==='Planejar a implementação'||R.ate_onde==='Executar a implementação'; }},

{id:'stack',tr:'briefing',b:'Tecnologia',t:'Que outros sistemas entram nessa história?',
  h:'CRM, BI, automação, integrações. Se não souber os nomes, descreva o que faz o quê.',tipo:'longo',escape:true,
  ph:'Ex.: Protheus no financeiro, planilhas no comercial...',
  se:function(){ return R.ate_onde==='Planejar a implementação'||R.ate_onde==='Executar a implementação'; }},

{id:'g_log',tr:'briefing',b:'Logística',t:'Para preparar a conversa',tipo:'grupo',escape:true,
  se:function(){ return R.budget==='Aprovado'||R.budget==='Em aprovação'; },subs:[
  {id:'participantes',lab:'Quem mais deveria participar',tipo:'texto',ph:'Nome e papel de cada pessoa'},
  {id:'restricoes',lab:'Restrições que eu deveria saber',tipo:'texto',ph:'Fornecedor atual, compras, sigilo, sindicato'}]},

{id:'origem',tr:'briefing',b:'Logística',t:'Como você chegou até o Garage?',tipo:'unica',
  ops:['Indicação','LinkedIn','Site','Evento','E-mail ou WhatsApp','Já conhecia','Outro']},

{id:'lgpd',tr:'ambos',b:'Logística',t:'Uma última coisa',tipo:'aceite',req:true,
  h:'Autorizo o Garage a usar o que preenchi aqui para preparar e priorizar nossa conversa, a pesquisar '+
    'informações públicas sobre a empresa, e a tratar meus dados de contato conforme a LGPD. Posso pedir a '+
    'exclusão a qualquer momento em facilitadores@garagecriativa.com.br. '+
    '<a href="../privacidade.html" target="_blank" rel="noopener">Como os dados são usados</a>'}
];

/* =========================================================================
   PONTUAÇÃO — só no briefing completo
   Proporção do respondido: quem não respondeu sai do numerador e do denominador;
   quem respondeu e vale zero permanece no denominador. Corte em 60%.
   ========================================================================= */
function idx(lista,mapa,valor){
  var p=lista.indexOf(valor); if(p<0) return null;
  var v=mapa[p]; return (v===null||v===undefined)?null:v;
}
function nivelGatop(m){
  if(!m||!m.length) return null;
  if(m.indexOf('Nenhum desses')>=0 && m.length===1) return 0;
  if(m.indexOf('Troca ou implantação de ERP')>=0 ||
     m.indexOf('Vaga aberta em processos, PMO, BI ou dados')>=0) return 3;
  var n=m.filter(function(x){return x!=='Nenhum desses';}).length;
  return n>=2?2:(n===1?1:0);
}
function nivelGatest(m){
  if(!m||!m.length) return null;
  if(m.indexOf('Nenhum desses')>=0 && m.length===1) return 0;
  var t3=['Entrada de sócio, fundo ou investidor','Aquisição ou fusão','Sucessão formalizada'];
  var t2=['Sucessão em curso','Conselho consultivo instalado'];
  for(var a=0;a<t3.length;a++) if(m.indexOf(t3[a])>=0) return 3;
  for(var b=0;b<t2.length;b++) if(m.indexOf(t2[b])>=0) return 2;
  if(m.indexOf('Expansão anunciada')>=0) return 1;
  return 0;
}
function pontuar(){
  var iu=idx(UNID,[0,1,2,3],R.unidades), ie=idx(ESTADOS,[0,2,3],R.estados);
  var c4=(iu===null&&ie===null)?null:Math.max(iu===null?-1:iu, ie===null?-1:ie);

  var c3=idx(REGIME,[0,2,3],R.regime);
  if(R.regime==='Lucro Presumido'){
    if(R.rob==='Até 4,8 milhões'||R.rob==='De 4,8 a 15 milhões') c3=1;
    if(R.rob==='De 60 a 80 milhões') c3=3;
  }
  var cdec=idx(DECISOR,[3,2,2,1,1],R.decisor);
  if(R.origem==='Indicação' && R.decisor && R.decisor!=='Eu decido' && cdec!==null) cdec=Math.min(3,cdec+1);

  var dorC=[
    {p:3,v:idx(PESSOAS,[0,1,2,3,3,null],R.pessoas)},
    {p:3,v:idx(ROB,[0,0,1,2,2,2,3,null],R.rob)},
    {p:2,v:c3},{p:2,v:c4},
    {p:2,v:idx(GRUPO,[0,1,2,3,null],R.grupocnpj)},
    {p:3,v:nivelGatop(R.gatop)},{p:3,v:nivelGatest(R.gatest)}];
  var decC=[
    {p:3,v:idx(ERP,[0,1,2,3,null],R.erp)},
    {p:3,v:idx(TI,[0,1,2,3],R.ti)},
    {p:2,v:idx(COMANDO,[0,1,2,3,null],R.comando)},
    {p:2,v:idx(JANELA,[3,2,1,0],R.janela)},
    {p:2,v:idx(CONSULT,[0,1,2,3,3],R.consultoria)},
    {p:3,v:cdec}];

  function soma(cs){ var n=0,d=0;
    cs.forEach(function(c){ if(c.v===null||c.v===undefined) return; n+=c.p*c.v; d+=c.p*3; });
    return {bruto:n,teto:d,pct:d?n/d:0}; }
  var dor=soma(dorC), dec=soma(decC), q;

  if(dor.pct>=0.6 && dec.pct>=0.6) q='ATACAR';
  else if(dor.pct>=0.6) q='NUTRIR';
  else if(dec.pct>=0.6) q='ENTRADA';
  else q='DESCARTAR';

  var tier='-';
  if(q==='ATACAR') tier=(R.ate_onde==='Planejar a implementação'||R.ate_onde==='Executar a implementação')?'Projeto':'Sprint';
  else if(q==='NUTRIR') tier='Isca';
  else if(q==='ENTRADA') tier=(R.budget==='Aprovado'||R.budget==='Em aprovação')?'Sonda':'Isca';

  return {dor:dor,dec:dec,quad:q,tier:tier,letra:{ATACAR:'A',NUTRIR:'B',ENTRADA:'C',DESCARTAR:'D'}[q]};
}

/* =========================================================================
   MOTOR
   ========================================================================= */
function noTrilho(q){ return q.tr==='ambos' || q.tr===trilha; }
function vis(){ return Q.filter(function(q){ return noTrilho(q) && (!q.se||q.se()); }); }
function ehReq(o){ return typeof o.req==='function' ? o.req() : !!o.req; }
function chave(q){ return q.alvo||q.id; }

function gravar(){ try{ localStorage.setItem(GUARDA,JSON.stringify({R:R,i:i,ts:Date.now()})); }catch(e){} }
function limpar(){ try{ localStorage.removeItem(GUARDA); }catch(e){} }
function guardado(){ try{ var g=JSON.parse(localStorage.getItem(GUARDA)||'null');
  return (g&&g.R&&Object.keys(g.R).length)?g:null; }catch(e){ return null; } }

var palco, barra;

function abertura(){
  barra.hidden=true;
  document.querySelector('#bar i').style.width='0';
  var g=guardado(), curto=(trilha==='bate');
  var h='<p class="marca">Garage<span class="hub"> Hub</span></p><div class="abertura">';
  if(g) h+='<div class="retomar">Você tem um preenchimento em andamento.'+
    '<br><button class="btn" id="retomar" type="button">Continuar de onde parei</button>'+
    '<button class="btn btn-vazio" id="recomecar" type="button">Começar de novo</button></div>';
  h+='<h1>Antes da nossa conversa</h1><hr class="regua">';
  h+= curto
    ? '<p class="help" style="font-size:1.0625rem;max-width:46ch">A conversa já começa no seu problema. '+
      'Nada aqui é compromisso.</p>'
    : '<p class="help" style="font-size:1.0625rem;max-width:46ch">Responder agora economiza metade da primeira reunião. '+
      'Nada aqui é compromisso.</p>';
  h+='<p class="help">'+(curto?'Cerca de 3 minutos. Quase tudo é marcar opção.'
                               :'Cerca de 12 minutos. A maior parte é marcar opção, e onde houver campo de escrever, dá para pular.')+'</p>';
  h+='<div class="comeco"><button class="btn" id="comecar" type="button">Começar</button></div>';
  h+='<p class="selo"><span>Seus dados não vão para lista nenhuma</span>'+
     '<a href="../privacidade.html">Como os dados são usados</a></p></div>';
  palco.innerHTML=h;

  document.getElementById('comecar').onclick=function(){ limpar(); R={}; i=0; render(); };
  var rt=document.getElementById('retomar');
  if(rt) rt.onclick=function(){ R=g.R; i=g.i; render(); };
  var rc=document.getElementById('recomecar');
  if(rc) rc.onclick=function(){ limpar(); abertura(); };
}

function campo(s){
  var v=R[s.id]||'', c;
  if(s.tipo==='select'){
    c='<select id="c_'+s.id+'"><option value="">Selecione</option>'+
      s.ops.map(function(o){return '<option'+(v===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>';
  } else if(s.tipo==='chips'){
    c='<div class="chips" data-alvo="'+s.id+'">'+s.ops.map(function(o){
      return '<button type="button" class="chip" aria-pressed="'+(v===o)+'" data-v="'+esc(o)+'">'+esc(o)+'</button>';}).join('')+'</div>';
  } else {
    var t=(s.tipo==='email')?'email':(s.tipo==='tel'?'tel':'text');
    c='<input type="'+t+'" id="c_'+s.id+'" placeholder="'+esc(s.ph||'')+'" value="'+esc(v)+'">';
  }
  return '<div class="campo"><label class="lab" for="c_'+s.id+'">'+s.lab+
    (ehReq(s)?' <span class="obrig">*</span>':'')+'</label>'+c+'</div>';
}

function corpo(q){
  var k=chave(q), v=R[k];
  if(q.tipo==='grupo') return '<div class="campos">'+q.subs.map(campo).join('')+'</div>';
  if(q.tipo==='texto'||q.tipo==='email'||q.tipo==='tel'){
    var t=(q.tipo==='email')?'email':(q.tipo==='tel'?'tel':'text');
    return '<input type="'+t+'" id="c_'+q.id+'" placeholder="'+esc(q.ph||'')+'" value="'+esc(v||'')+'">';
  }
  if(q.tipo==='longo') return '<textarea id="c_'+q.id+'" placeholder="'+esc(q.ph||'')+'">'+esc(v||'')+'</textarea>';
  if(q.tipo==='select') return '<select id="c_'+q.id+'"><option value="">Selecione</option>'+
    q.ops.map(function(o){return '<option'+(v===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>';
  if(q.tipo==='aceite') return '<div class="aceite"><input type="checkbox" id="c_'+q.id+'"'+
    (v===true?' checked':'')+'><label for="c_'+q.id+'">'+q.h+'</label></div>';

  var ops=q.opsDin?q.opsDin():q.ops, multi=(q.tipo==='multi');
  var sel=multi?(Array.isArray(v)?v:[]):v;
  return '<div class="opcoes" data-alvo="'+k+'" data-multi="'+multi+'">'+ops.map(function(o,n){
    var on=multi?(sel.indexOf(o)>=0):(sel===o);
    return '<button type="button" class="op" aria-pressed="'+on+'" data-v="'+esc(o)+'">'+
      '<span class="tecla">'+String.fromCharCode(65+n)+'</span><span>'+esc(o)+'</span></button>';}).join('')+'</div>';
}

function render(){
  var L=vis();
  if(i>=L.length) return fechar();
  if(i<0) i=0;
  var q=L[i];
  barra.hidden=false;
  document.querySelector('#bar i').style.width=(i/L.length*100)+'%';
  document.getElementById('voltar').style.visibility=(i===0?'hidden':'visible');

  var h='<p class="marca">Garage<span class="hub"> Hub</span></p>';
  h+='<div class="idx">'+q.b+' · '+(i+1)+' de '+L.length+'</div>';
  h+='<h1>'+txt(q.t)+((ehReq(q)&&q.tipo!=='aceite')?' <span class="obrig">*</span>':'')+'</h1>';
  if(q.h&&q.tipo!=='aceite') h+='<div class="help">'+q.h+'</div>';
  if(R[chave(q)]===PULAR){
    h+='<div class="pulado">Você optou por falar sobre isto na conversa. Anotado.</div>';
  } else {
    h+=corpo(q);
    if(q.escape) h+='<button class="escape" id="btnEscape" type="button">Prefiro falar sobre isso na conversa</button>';
  }
  h+='<div class="erro" id="erro"></div>';
  palco.innerHTML=h;
  ligar(q);
  document.getElementById('avancar').textContent=(i===L.length-1)?'Enviar':'OK';
  window.scrollTo(0,0);
}

function erro(m){ var e=document.getElementById('erro'); if(e) e.textContent=m||''; }

function ligar(q){
  Array.prototype.forEach.call(document.querySelectorAll('.opcoes'),function(g){
    var alvo=g.getAttribute('data-alvo'), multi=g.getAttribute('data-multi')==='true';
    Array.prototype.forEach.call(g.querySelectorAll('.op'),function(b){
      b.onclick=function(){
        var v=b.getAttribute('data-v');
        if(multi){
          var cur=Array.isArray(R[alvo])?R[alvo].slice():[], p=cur.indexOf(v);
          if(p>=0) cur.splice(p,1);
          else{ if(q.max&&cur.length>=q.max){ erro('Escolha até '+q.max+'.'); return; } cur.push(v); }
          R[alvo]=cur; b.setAttribute('aria-pressed',cur.indexOf(v)>=0); erro('');
        } else {
          R[alvo]=v;
          Array.prototype.forEach.call(g.querySelectorAll('.op'),function(o){o.setAttribute('aria-pressed','false');});
          b.setAttribute('aria-pressed','true'); erro(''); setTimeout(avancar,140);
        }
        gravar();
      };
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.chips'),function(g){
    var alvo=g.getAttribute('data-alvo');
    Array.prototype.forEach.call(g.querySelectorAll('.chip'),function(b){
      b.onclick=function(){
        R[alvo]=b.getAttribute('data-v');
        Array.prototype.forEach.call(g.querySelectorAll('.chip'),function(o){o.setAttribute('aria-pressed','false');});
        b.setAttribute('aria-pressed','true'); erro(''); gravar();
      };
    });
  });
  var e=document.getElementById('btnEscape');
  if(e) e.onclick=function(){ R[chave(q)]=PULAR; if(q.subs) q.subs.forEach(function(s){R[s.id]=PULAR;}); gravar(); render(); };
  var primeiro=palco.querySelector('input[type=text],input[type=email],input[type=tel],textarea,select');
  if(primeiro) primeiro.focus();
}

function colher(q){
  var k=chave(q);
  if(R[k]===PULAR) return;
  if(q.tipo==='grupo'){
    q.subs.forEach(function(s){
      var el=document.getElementById('c_'+s.id);
      if(el && s.tipo!=='chips') R[s.id]=el.value.trim();
    });
  } else if(q.tipo==='aceite'){
    var c=document.getElementById('c_'+q.id); if(c) R[k]=c.checked;
  } else if(q.tipo!=='unica' && q.tipo!=='multi'){
    var el2=document.getElementById('c_'+q.id); if(el2) R[k]=el2.value.trim();
  }
}

function emailOk(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }
function telOk(v){ return (String(v).replace(/\D/g,'').length>=10); }

function valido(q){
  var k=chave(q);
  if(R[k]===PULAR) return true;
  if(q.tipo==='aceite'){ if(!R[k]){ erro('Preciso do aceite para seguir.'); return false; } return true; }
  if(q.tipo==='grupo'){
    for(var n=0;n<q.subs.length;n++){
      var s=q.subs[n], rot=s.lab.replace(/<[^>]+>/g,'').trim();
      if(ehReq(s) && !R[s.id]){ erro('Falta preencher: '+rot+'.'); return false; }
      if(s.tipo==='email' && R[s.id] && !emailOk(R[s.id])){ erro('Confira o e-mail.'); return false; }
      if(s.tipo==='tel' && R[s.id] && !telOk(R[s.id])){ erro('Confira o WhatsApp — com DDD.'); return false; }
    }
    return true;
  }
  if(ehReq(q)){
    var v=R[k], vazio=(v===undefined||v===null||v===''||(Array.isArray(v)&&!v.length));
    if(vazio){ erro(q.id==='subsetor'?'Como você marcou Outro, escreva em uma linha o que a empresa faz.':'Essa eu preciso.'); return false; }
  }
  if(q.tipo==='tel' && R[k] && !telOk(R[k])){ erro('Confira o WhatsApp — com DDD.'); return false; }
  return true;
}

function avancar(){ var L=vis(), q=L[i]; colher(q); if(!valido(q)) return; gravar(); i++; render(); }
function voltar(){ var L=vis(); colher(L[i]); gravar(); i--; render(); }

/* =========================================================================
   FECHAMENTO E ENVIO
   ========================================================================= */
function hoje(){ var d=new Date(), z=function(n){return n<10?'0'+n:''+n;};
  return z(d.getDate())+'/'+z(d.getMonth()+1)+'/'+d.getFullYear(); }

function linhaCSV(p){
  return [R.empresa||'',R.cnpj||'',R.mun||'',R.uf||'',R.setor||'','Inbound',
    p.dor.bruto,p.dec.bruto,p.quad,p.letra,p.tier,hoje()]
    .map(function(x){ return String(x).replace(/;/g,','); }).join(';');
}

function corpoEmail(p){
  var L=[];
  L.push(trilha==='bate'?'BATE-PAPO':'BRIEFING COMPLETO');
  L.push(hoje()); L.push('');
  if(p){
    L.push('QUALIFICAÇÃO');
    L.push('dor  '+p.dor.bruto+' de '+p.dor.teto+' respondidos  ('+Math.round(p.dor.pct*100)+'%)');
    L.push('dec  '+p.dec.bruto+' de '+p.dec.teto+' respondidos  ('+Math.round(p.dec.pct*100)+'%)');
    L.push('quadrante  '+p.quad+'   degrau  '+p.tier); L.push('');
    L.push('LINHA PARA A FICHA');
    L.push('nome;cnpj;mun;uf;vert;orig;dor;dec;total;quad;tier;data');
    L.push(linhaCSV(p)); L.push('');
  }
  L.push('RESPOSTAS');
  vis().forEach(function(q){
    if(q.tipo==='aceite') return;
    if(q.tipo==='grupo'){
      q.subs.forEach(function(s){ var v=R[s.id];
        L.push('· '+s.lab.replace(/<[^>]+>/g,'').trim()+': '+(v===PULAR?'[deixou para a conversa]':(v||'—'))); });
    } else {
      var v=R[chave(q)];
      if(Array.isArray(v)) v=v.join(' | ');
      if(v===PULAR) v='[deixou para a conversa]';
      L.push('· '+String(txt(q.t)).replace(/<[^>]+>/g,'').trim()+': '+(v||'—'));
    }
  });
  L.push(''); L.push('Aceite LGPD: '+(R.lgpd?'sim':'não'));
  return L.join('\n');
}

function fechar(){
  var p=(trilha==='briefing')?pontuar():null;
  enviando=true; barra.hidden=true;
  document.querySelector('#bar i').style.width='100%';
  palco.innerHTML='<p class="marca">Garage<span class="hub"> Hub</span></p><div class="fim"><h1>Enviando…</h1></div>';

  var assunto='['+(trilha==='bate'?'BATE-PAPO':'BRIEFING-COMPLETO')+'] '+(R.empresa||'sem empresa')+' — '+hoje();

  fetch(ENVIO.url,{method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify({access_key:ENVIO.chave,subject:assunto,
      from_name:'Sala de entrada — Garage Hub',replyto:R.email||'',message:corpoEmail(p)})
  }).then(function(r){return r.json();})
    .then(function(d){ if(d&&d.success) sucesso(p); else falha(); })
    .catch(function(){ falha(); });
}

function sucesso(p){
  limpar(); enviando=false;
  var quente=p&&(p.quad==='ATACAR'||p.quad==='ENTRADA');
  var h='<p class="marca">Garage<span class="hub"> Hub</span></p><div class="fim">';
  h+='<h1>Obrigado, '+esc(pn())+'.</h1><hr class="regua" style="max-width:120px">';
  if(trilha==='bate')
    h+='<p>Vou olhar o contexto da '+esc(emp())+' e te chamo em até 3 dias úteis para marcarmos a conversa.</p>';
  else if(quente)
    h+='<p>Vou ler o contexto da '+esc(emp())+' e te mando um convite de agenda em até 3 dias úteis. '+
       'Se quiser adiantar alguma coisa, é só responder este e-mail.</p>';
  else
    h+='<p>Vou olhar o contexto da '+esc(emp())+' e te escrevo em até 3 dias úteis. '+
       'Se eu achar que agora não é o momento de avançar, digo isso também — e explico por quê.</p>';
  palco.innerHTML=h+'</div>';
}

function falha(){
  enviando=false;
  palco.innerHTML='<p class="marca">Garage<span class="hub"> Hub</span></p><div class="fim">'+
    '<h1>O envio não completou.</h1>'+
    '<p>Suas respostas estão salvas neste navegador — nada se perdeu. Tente de novo, e se insistir, '+
    'me escreva em <a href="mailto:'+ENVIO.destino+'">'+ENVIO.destino+'</a>.</p>'+
    '<p><button class="btn" id="retry" type="button">Tentar enviar de novo</button></p></div>';
  document.getElementById('retry').onclick=fechar;
}

/* ---------- arranque ------------------------------------------------------ */
document.addEventListener('DOMContentLoaded',function(){
  palco=document.getElementById('palco');
  barra=document.getElementById('barra');
  document.getElementById('avancar').onclick=function(){ if(!enviando) avancar(); };
  document.getElementById('voltar').onclick=voltar;
  document.addEventListener('keydown',function(ev){
    if(ev.key==='Enter'&&!ev.shiftKey){
      if(ev.target.tagName==='TEXTAREA'&&!ev.metaKey&&!ev.ctrlKey) return;
      ev.preventDefault(); if(!enviando&&!barra.hidden) avancar();
    }
  });
  abertura();
});
