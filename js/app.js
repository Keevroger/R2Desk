/* R2Desk - Lógica do front-end
   JavaScript responsável por navegação, chamados, filtros, notificações e interações. */

document.documentElement.dataset.theme = localStorage.getItem('r2deskTheme') || 'light';

/* =========================================================
   Utilitários de DOM
   ========================================================= */
const $ = id => document.getElementById(id), $$ = sel => Array.from(document.querySelectorAll(sel));

/* =========================================================
   Dados do catálogo e da base de conhecimento
   ========================================================= */
const AREAS = [
    { name: 'Infraestrutura', key: 'infra', desc: 'Rede, VPN, servidores, conectividade, telefonia e ambiente corporativo.', services: ['Rede e Internet', 'VPN', 'Servidores', 'Telefonia', 'Wi-Fi corporativo'] },
    { name: 'Help Desk', key: 'help', desc: 'Notebook, desktop, monitor, impressora, Windows e periféricos.', services: ['Notebook / Desktop', 'Monitores e docks', 'Impressoras', 'Windows', 'Periféricos'] },
    { name: 'Service Desk', key: 'service', desc: 'Acessos, senhas, requisições, triagem e atendimento de primeiro nível.', services: ['Senha e desbloqueio', 'Acessos e permissões', 'Instalação de software', 'Solicitação geral', 'Orientação ao usuário'] },
    { name: 'Sistemas Comerciais', key: 'commercial', desc: 'Salesforce, pedidos, integrações comerciais e aplicações de vendas.', services: ['Salesforce / CRM', 'Pedidos e faturamento', 'Integrações comerciais', 'Cadastro de clientes', 'Aplicações de vendas'] },
    { name: 'Sistemas Corporativos', key: 'corp', desc: 'Microsoft 365, ERP, RH, financeiro e aplicações internas.', services: ['Microsoft 365', 'ERP corporativo', 'Sistemas de RH', 'Sistemas Financeiros', 'Portais internos'] },
    { name: 'BI', key: 'bi', desc: 'Power BI, dashboards, indicadores, relatórios, bases e qualidade de dados.', services: ['Power BI', 'Dashboards', 'Relatórios', 'Dados e indicadores', 'Atualização de datasets'] }
];
const ARTICLES = [
    { id: 'first-ticket', area: 'Service Desk', title: 'Primeiros passos: como abrir seu primeiro chamado', summary: 'Aprenda a abrir uma solicitação no R2Desk da classificação até a revisão final.', time: '3 min', service: 'Solicitação geral', lead: 'Se esta é sua primeira vez no R2Desk, este guia mostra o caminho mais simples para registrar uma solicitação com as informações que a TI realmente precisa.', steps: ['Na página inicial, escolha uma Área de atendimento ou clique em “+ Novo chamado”.', 'Na etapa Classificação, confirme a área, escolha o serviço e indique se é Incidente, Solicitação, Dúvida ou Melhoria.', 'Em Detalhes, escreva um assunto objetivo e descreva o que precisa ou o erro encontrado.', 'Selecione a urgência de acordo com o impacto no seu trabalho e anexe evidências, se houver.', 'Na etapa Revisão, confira o direcionamento, as informações enviadas à TI e o SLA inicial; então clique em “Confirmar e enviar”.', 'Depois do envio, acompanhe o chamado em “Meus chamados”.'], note: 'Se estiver em dúvida sobre qual área escolher, use o artigo “Como escolher área e urgência” ou selecione Service Desk para triagem inicial.' },
    { id: 'choose-service', area: 'Service Desk', title: 'Como escolher a área, o serviço e a urgência', summary: 'Um guia rápido para classificar corretamente seu chamado e evitar redirecionamentos.', time: '4 min', service: 'Orientação ao usuário', lead: 'Uma boa classificação ajuda o R2Desk a encaminhar sua solicitação direto para a equipe certa.', steps: ['Use Infraestrutura para rede, VPN, servidores, Wi-Fi e telefonia.', 'Use Help Desk para notebook, desktop, monitor, impressora, Windows e periféricos.', 'Use Service Desk para senhas, acessos, instalações e solicitações gerais.', 'Use Sistemas Comerciais para Salesforce, CRM, pedidos, faturamento e integrações comerciais.', 'Use Sistemas Corporativos para Microsoft 365, ERP, RH, financeiro e portais internos.', 'Use BI para Power BI, dashboards, relatórios, datasets e indicadores.', 'Marque urgência Normal quando consegue seguir trabalhando, Alta quando há impacto relevante e Imediata quando a operação está parada ou afeta várias pessoas.'], note: 'A prioridade exibida na revisão é uma estimativa inicial e pode ser ajustada pela equipe durante a triagem.' },
    { id: 'follow-ticket', area: 'Service Desk', title: 'Como acompanhar, responder e entender seu chamado', summary: 'Saiba onde consultar status, SLA, histórico e conversar com a equipe de TI.', time: '3 min', service: 'Orientação ao usuário', lead: 'Depois de abrir um chamado, você não precisa criar outro para pedir atualização. Toda a conversa pode continuar dentro do mesmo atendimento.', steps: ['Abra “Meus chamados” no menu lateral.', 'Use os filtros de área ou data para encontrar a solicitação desejada.', 'Clique no chamado para abrir a página completa do atendimento.', 'Confira status, prioridade, SLA, responsável, descrição inicial e anexos.', 'Use o campo “Conversa do chamado” para enviar dúvidas ou informações adicionais à equipe de TI.', 'Acompanhe a caixa de notificações no topo para saber quando houver resolução ou atualização importante.'], note: 'Se o status estiver “Aguardando usuário”, responda pelo próprio chamado para que o atendimento possa continuar.' },
    { id: 'reset-password', area: 'Service Desk', title: 'Como redefinir sua senha corporativa', summary: 'Passo a passo para senha expirada, redefinição e desbloqueio de conta.', time: '4 min', service: 'Senha e desbloqueio', lead: 'Antes de abrir um chamado, tente este procedimento para redefinir a senha da sua conta corporativa.', steps: ['Acesse a tela de login corporativo e selecione “Esqueci minha senha”.', 'Confirme seu usuário ou e-mail corporativo.', 'Valide sua identidade pelo método configurado de MFA.', 'Crie uma nova senha seguindo os requisitos exibidos na tela.', 'Aguarde alguns minutos e tente entrar novamente.'], note: 'Se sua conta estiver bloqueada ou você não tiver acesso ao método de MFA, abra um chamado para o Service Desk.' },
    { id: 'vpn-check', area: 'Infraestrutura', title: 'VPN: verificações antes de abrir um chamado', summary: 'Confira conexão, autenticação, MFA e cliente VPN antes de acionar a equipe.', time: '5 min', service: 'VPN', lead: 'Algumas falhas de VPN podem ser resolvidas com verificações simples antes do atendimento.', steps: ['Confirme se sua internet está funcionando fora da VPN.', 'Feche totalmente o cliente de VPN e abra novamente.', 'Verifique se data e hora do Windows estão corretas.', 'Faça uma nova autenticação e confirme o MFA.', 'Anote a mensagem de erro ou tire um print caso o problema continue.'], note: 'Se a VPN conectar e cair logo depois, informe no chamado em quanto tempo a sessão é encerrada.' },
    { id: 'salesforce-access', area: 'Sistemas Comerciais', title: 'Acesso e permissões no Salesforce', summary: 'Entenda quando solicitar perfil, Permission Set ou ajuste de visibilidade.', time: '6 min', service: 'Salesforce / CRM', lead: 'Problemas de acesso ao Salesforce podem estar relacionados a usuário, perfil, permission set ou visibilidade do registro.', steps: ['Confirme se consegue autenticar no Salesforce.', 'Verifique se o aplicativo esperado aparece no App Launcher.', 'Identifique qual tela, objeto ou ação está indisponível.', 'Se possível, informe um colega que possua o mesmo acesso esperado.', 'Anexe print da mensagem de erro ou da opção ausente.'], note: 'Nunca envie sua senha no chamado. A equipe de TI não precisa dela para validar permissões.' },
    { id: 'powerbi-refresh', area: 'BI', title: 'Power BI sem atualizar dados', summary: 'Como identificar se o problema está no dataset, gateway ou fonte de dados.', time: '4 min', service: 'Power BI', lead: 'Antes de acionar BI, valide se o problema afeta um único relatório ou vários dashboards.', steps: ['Confira a data e hora da última atualização exibida no relatório.', 'Teste outro relatório que use a mesma fonte, se disponível.', 'Verifique se o problema ocorre para outros usuários.', 'Anote qual página e indicador parecem desatualizados.', 'Ao abrir o chamado, informe o link ou nome do workspace.'], note: 'Se houver dados sensíveis, não copie informações confidenciais para o campo de descrição.' },
    { id: 'monitor-windows', area: 'Help Desk', title: 'Segundo monitor não aparece no Windows', summary: 'Checklist de cabo, dock, energia e detecção de monitores externos.', time: '3 min', service: 'Monitores e docks', lead: 'Use este checklist rápido para problemas com segundo monitor ou dock.', steps: ['Confirme energia do monitor e conexão do cabo.', 'Reconecte o cabo de vídeo e a dock.', 'Use Windows + P e selecione “Estender”.', 'Abra Configurações > Sistema > Tela e clique em Detectar.', 'Teste outra porta ou cabo, se disponível.'], note: 'Se continuar sem imagem, informe no chamado o modelo da dock e do monitor.' },
    { id: 'outlook-password', area: 'Sistemas Corporativos', title: 'Outlook pedindo senha repetidamente', summary: 'Verificações iniciais para credenciais e autenticação do Microsoft 365.', time: '4 min', service: 'Microsoft 365', lead: 'Solicitações repetidas de senha podem estar relacionadas à sessão do Microsoft 365 ou credenciais armazenadas.', steps: ['Feche Outlook, Teams e demais aplicativos Microsoft 365.', 'Confirme que sua conta funciona no portal web.', 'Abra novamente o Outlook e autentique quando solicitado.', 'Conclua o MFA, se solicitado.', 'Se o aviso continuar, tire um print e abra um chamado.'], note: 'Não compartilhe códigos de MFA ou senha com o suporte.' }
];

/* =========================================================
   Dados demonstrativos e estado local do protótipo
   ========================================================= */
const seed = [
    { id: 'INC-1084', subject: 'VPN desconecta após autenticação', requester: 'Marina Lopes', email: 'marina.lopes@empresa.com', area: 'Infraestrutura', service: 'VPN', type: 'Incidente', priority: 'Alta', urgency: 'Alta', status: 'Em atendimento', owner: 'Kevin Santos', group: 'Infraestrutura N2', sla: '2h 18m', created: '08/09/2026 14:18', description: 'A VPN conecta após MFA e encerra a sessão em poucos segundos.', attachments: [], messages: [{ author: 'Marina Lopes', role: 'requester', at: '08/09/2026 14:18', text: 'A VPN conecta após MFA e encerra a sessão em poucos segundos.' }, { author: 'Kevin Santos', role: 'admin', at: '08/09/2026 14:35', text: 'Olá, Marina. Estamos validando os logs de autenticação. Você consegue confirmar se o problema acontece em outra rede?' }] },
    { id: 'INC-1083', subject: 'Usuário sem acesso ao Salesforce', requester: 'Kevin Santos', email: 'solicitante@r2desk.com', area: 'Sistemas Comerciais', service: 'Salesforce / CRM', type: 'Incidente', priority: 'Média', urgency: 'Normal', status: 'Aberto', owner: 'Não atribuído', group: 'Sistemas Comerciais', sla: '6h 40m', created: '08/09/2026 13:52', description: 'Ao entrar no Salesforce, a aplicação comercial não aparece no App Launcher.', attachments: [], messages: [{ author: 'Kevin Santos', role: 'requester', at: '08/09/2026 13:52', text: 'Ao entrar no Salesforce, a aplicação comercial não aparece no App Launcher.' }] },
    { id: 'INC-1082', subject: 'Notebook não reconhece segundo monitor', requester: 'Paula Nunes', email: 'paula.nunes@empresa.com', area: 'Help Desk', service: 'Monitores e docks', type: 'Incidente', priority: 'Baixa', urgency: 'Normal', status: 'Aguardando usuário', owner: 'Lucas Rocha', group: 'Help Desk N1', sla: '15h 12m', created: '08/09/2026 11:33', description: 'Segundo monitor conectado pela dock USB-C não é reconhecido.', attachments: [], messages: [] },
    { id: 'INC-1081', subject: 'Pedido não aparece integrado no CRM', requester: 'Kevin Santos', email: 'solicitante@r2desk.com', area: 'Sistemas Comerciais', service: 'Integrações comerciais', type: 'Incidente', priority: 'Alta', urgency: 'Alta', status: 'Em atendimento', owner: 'Kevin Santos', group: 'Sistemas Comerciais', sla: '1h 08m', created: '08/09/2026 10:41', description: 'Pedido confirmado no ERP não aparece no CRM depois da integração.', attachments: [], messages: [{ author: 'Kevin Santos', role: 'requester', at: '08/09/2026 10:41', text: 'Pedido confirmado no ERP não aparece no CRM depois da integração.' }, { author: 'Kevin Santos - TI', role: 'admin', at: '08/09/2026 11:05', text: 'Recebido. Estamos conferindo o retorno da integração e o processamento no CRM.' }] },
    { id: 'INC-1080', subject: 'Outlook solicitando senha repetidamente', requester: 'Renata Dias', email: 'renata.dias@empresa.com', area: 'Sistemas Corporativos', service: 'Microsoft 365', type: 'Incidente', priority: 'Média', urgency: 'Normal', status: 'Resolvido', owner: 'Ana Costa', group: 'Sistemas Corporativos', sla: 'Concluído', created: '08/09/2026 09:18', description: 'Outlook abre a janela de credenciais repetidamente.', attachments: [], messages: [] },
    { id: 'INC-1079', subject: 'Dashboard comercial não atualizou', requester: 'Kevin Santos', email: 'solicitante@r2desk.com', area: 'BI', service: 'Power BI', type: 'Incidente', priority: 'Média', urgency: 'Normal', status: 'Resolvido', owner: 'Carla Mendes', group: 'BI', sla: 'Concluído', created: '07/09/2026 16:05', description: 'Dados do dashboard comercial estão com a atualização do dia anterior.', attachments: [], messages: [] },
    { id: 'INC-1078', subject: 'Conta bloqueada no Windows', requester: 'João Vieira', email: 'joao.vieira@empresa.com', area: 'Service Desk', service: 'Senha e desbloqueio', type: 'Solicitação', priority: 'Baixa', urgency: 'Normal', status: 'Resolvido', owner: 'Ana Costa', group: 'Service Desk N1', sla: 'Concluído', created: '07/09/2026 15:12', description: 'Conta bloqueada após tentativas de senha incorreta.', attachments: [], messages: [] },
    { id: 'INC-1077', subject: 'ERP indisponível para o financeiro', requester: 'Roberta Lima', email: 'roberta.lima@empresa.com', area: 'Sistemas Corporativos', service: 'ERP corporativo', type: 'Incidente', priority: 'Crítica', urgency: 'Imediata', status: 'Em atendimento', owner: 'Marcelo Alves', group: 'Sistemas Corporativos', sla: '22m', created: '08/09/2026 15:07', description: 'Equipe financeira não consegue acessar o ERP.', attachments: [], messages: [] }
];
let tickets = JSON.parse(localStorage.getItem('r2deskTicketsV2') || 'null') || JSON.parse(localStorage.getItem('r2deskTicketsV1') || 'null') || seed;
tickets = tickets.map(t => ({ ...t, attachments: Array.isArray(t.attachments) ? t.attachments : [], messages: Array.isArray(t.messages) && t.messages.length ? t.messages : [{ author: t.requester, role: 'requester', at: t.created, text: t.description }] }));
let role = 'requester', loginRole = 'requester', wizardStep = 1, selectedIssue = 'Incidente', selectedUrgency = 'Normal', selectedFiles = [], statusFilter = 'all', areaFilter = 'all', currentTicketId = null, knowledgeFilter = 'Todos', myAreaFilter = 'all', myDateFrom = '', myDateTo = '';
let notifications = JSON.parse(localStorage.getItem('r2deskNotificationsV1') || 'null') || [
    { id: 'portal-update-1209', type: 'portal', title: 'R2Desk atualizado', text: 'A Base de Conhecimento ganhou novos guias para primeiros acessos e melhorias de navegação.', at: '12/09/2026 17:00', read: false },
    { id: 'resolved-inc1079', type: 'ticket', ticketId: 'INC-1079', title: 'Chamado resolvido', text: 'INC-1079 • Dashboard comercial não atualizou foi marcado como resolvido.', at: '07/09/2026 17:02', read: false }
];
function save() { localStorage.setItem('r2deskTicketsV2', JSON.stringify(tickets)); }
function saveNotifications() { localStorage.setItem('r2deskNotificationsV1', JSON.stringify(notifications)); }

/* =========================================================
   Notificações
   ========================================================= */
function addNotification(data) { const n = { id: data.id || ('n-' + Date.now() + '-' + Math.random().toString(16).slice(2)), type: data.type || 'portal', ticketId: data.ticketId || null, title: data.title || 'Atualização', text: data.text || '', at: data.at || new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), read: false }; notifications.unshift(n); notifications = notifications.slice(0, 30); saveNotifications(); renderNotifications(); }
function renderNotifications() { if (!$('notificationList'))
    return; const unread = notifications.filter(n => !n.read).length; $('notificationBadge').textContent = unread; $('notificationBadge').classList.toggle('hidden', unread === 0); $('notificationList').innerHTML = notifications.length ? notifications.map(n => `<button type="button" class="notification-item ${n.read ? '' : 'unread'}" data-notification="${n.id}"><span class="notification-dot">${n.type === 'ticket' ? '✓' : 'i'}</span><span class="notification-copy"><b>${esc(n.title)}</b><p>${esc(n.text)}</p><small>${esc(n.at)}</small></span></button>`).join('') : '<div class="notification-empty">Nenhuma notificação por enquanto.</div>'; $$('[data-notification]').forEach(b => b.onclick = () => { const n = notifications.find(x => x.id === b.dataset.notification); if (!n)
    return; n.read = true; saveNotifications(); renderNotifications(); $('notificationPanel').classList.remove('open'); $('notificationBtn').classList.remove('active'); if (n.ticketId && tickets.some(t => t.id === n.ticketId))
    openTicketDetail(n.ticketId);
else
    goPage('portal'); }); }

/* =========================================================
   Funções auxiliares, navegação e estilos de status
   ========================================================= */
function esc(v) { return String(v ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function toast(msg) { $('toast').textContent = msg; $('toast').classList.add('show'); clearTimeout(window.__toast); window.__toast = setTimeout(() => $('toast').classList.remove('show'), 2600); }
function statusClass(s) { return s === 'Resolvido' ? 'b-done' : s === 'Em atendimento' ? 'b-progress' : s === 'Aguardando usuário' ? 'b-wait' : 'b-open'; }
function prioClass(p) { return p === 'Crítica' ? 'p-critical' : p === 'Alta' ? 'p-high' : p === 'Média' ? 'p-medium' : 'p-low'; }
function pageMeta(id) { const m = { portal: ['Portal de Serviços', 'Solicite suporte e acompanhe seus chamados'], myTickets: ['Meus chamados', 'Acompanhe suas solicitações'], knowledge: ['Base de conhecimento', 'Encontre respostas e procedimentos'], ticketDetail: ['Detalhes do chamado', 'Acompanhe e interaja com o atendimento'], articleDetail: ['Base de conhecimento', 'Procedimento e orientações'], adminDashboard: ['Dashboard da Central', 'Visão operacional do atendimento'], queue: ['Central de atendimento', 'Triagem, atribuição e acompanhamento'], catalog: ['Áreas & catálogo', 'Estrutura de serviços de TI'], reports: ['Relatórios', 'Indicadores do atendimento'] }; return m[id] || ['R2Desk Service Management', '']; }
function goPage(id) { $$('.page').forEach(p => p.classList.toggle('active', p.id === id)); $$('.nav button[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === id)); const [t, s] = pageMeta(id); $('topTitle').textContent = t; $('topSubtitle').textContent = s; window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* =========================================================
   Catálogo de serviços e renderização das áreas
   ========================================================= */
function areaIllustration(key) {
    const scenes = {
        infra: `<svg viewBox="0 0 220 100" aria-hidden="true"><defs><linearGradient id="ig1" x1="0" x2="1"><stop stop-color="#5a72f5"/><stop offset="1" stop-color="#8fa1ff"/></linearGradient><linearGradient id="ig2" x1="0" x2="1"><stop stop-color="#18294b"/><stop offset="1" stop-color="#263d70"/></linearGradient></defs><rect x="9" y="8" width="202" height="84" rx="20" fill="url(#ig2)"/><circle cx="44" cy="22" r="20" fill="#6680ff" opacity=".18"/><path d="M37 52h146M58 51V36m104 15V36M110 52V27" stroke="#93a7ff" stroke-width="2" opacity=".75"/><g fill="#101b31" stroke="#8399ff" stroke-width="1.5"><rect x="25" y="51" width="42" height="27" rx="7"/><rect x="89" y="51" width="42" height="27" rx="7"/><rect x="153" y="51" width="42" height="27" rx="7"/></g><g fill="#78a0ff"><circle cx="35" cy="61" r="3"/><circle cx="99" cy="61" r="3"/><circle cx="163" cy="61" r="3"/></g><path d="M88 27c2-10 11-16 22-14 6-8 19-8 26-1 10-2 19 5 19 14 0 9-7 14-17 14H87c-9 0-16-5-16-12s7-13 17-13" fill="url(#ig1)" opacity=".95"/><path d="M97 25h29" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".75"/></svg>`,
        help: `<svg viewBox="0 0 220 100" aria-hidden="true"><defs><linearGradient id="hg1" x1="0" x2="1"><stop stop-color="#17a77a"/><stop offset="1" stop-color="#6bd8b3"/></linearGradient></defs><rect x="9" y="8" width="202" height="84" rx="20" fill="#102a28"/><rect x="26" y="22" width="105" height="58" rx="9" fill="#0c1d22" stroke="#45c39d" stroke-width="1.5"/><rect x="37" y="31" width="82" height="38" rx="5" fill="#17343a"/><path d="M22 82h113l-10-11H32z" fill="url(#hg1)" opacity=".9"/><circle cx="166" cy="45" r="28" fill="#17483d" stroke="#46cda4" stroke-width="2"/><path d="M153 45l9 9 18-22" fill="none" stroke="#7ff1c9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="43" cy="38" r="4" fill="#5be1b5"/><rect x="52" y="35" width="48" height="6" rx="3" fill="#32555a"/><rect x="42" y="50" width="67" height="5" rx="2.5" fill="#2c4d52"/></svg>`,
        service: `<svg viewBox="0 0 220 100" aria-hidden="true"><defs><linearGradient id="sg1" x1="0" x2="1"><stop stop-color="#e3a13a"/><stop offset="1" stop-color="#ffd27b"/></linearGradient></defs><rect x="9" y="8" width="202" height="84" rx="20" fill="#322619"/><circle cx="74" cy="48" r="27" fill="#4a3520"/><path d="M51 49v-8a23 23 0 0 1 46 0v8" fill="none" stroke="#ffc95c" stroke-width="4"/><rect x="45" y="45" width="12" height="24" rx="6" fill="url(#sg1)"/><rect x="91" y="45" width="12" height="24" rx="6" fill="url(#sg1)"/><path d="M97 66c-4 8-12 10-22 10" fill="none" stroke="#f3b44a" stroke-width="3" stroke-linecap="round"/><rect x="124" y="22" width="70" height="53" rx="12" fill="#211d1a" stroke="#916c32"/><circle cx="140" cy="39" r="7" fill="#f1b44d"/><rect x="153" y="34" width="28" height="6" rx="3" fill="#72582f"/><rect x="136" y="53" width="45" height="5" rx="2.5" fill="#5c4a31"/><rect x="136" y="63" width="34" height="5" rx="2.5" fill="#5c4a31"/></svg>`,
        commercial: `<svg viewBox="0 0 220 100" aria-hidden="true"><defs><linearGradient id="cg1" x1="0" x2="1"><stop stop-color="#2e8fd1"/><stop offset="1" stop-color="#79c9ff"/></linearGradient></defs><rect x="9" y="8" width="202" height="84" rx="20" fill="#12283a"/><rect x="24" y="19" width="103" height="63" rx="10" fill="#0f1f2c" stroke="#3c9bd9"/><rect x="36" y="31" width="45" height="7" rx="3.5" fill="#52b7f1"/><rect x="36" y="46" width="73" height="5" rx="2.5" fill="#294d63"/><rect x="36" y="57" width="58" height="5" rx="2.5" fill="#294d63"/><circle cx="163" cy="38" r="23" fill="url(#cg1)"/><path d="M151 38h24M163 26v24" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M136 76h57" stroke="#3f789a" stroke-width="5" stroke-linecap="round"/><path d="M145 67h39" stroke="#27536c" stroke-width="5" stroke-linecap="round"/></svg>`,
        corp: `<svg viewBox="0 0 220 100" aria-hidden="true"><defs><linearGradient id="pg1" x1="0" x2="1"><stop stop-color="#835bd2"/><stop offset="1" stop-color="#b99aff"/></linearGradient></defs><rect x="9" y="8" width="202" height="84" rx="20" fill="#261f37"/><path d="M31 80V38h55v42M99 80V22h79v58" fill="#171423" stroke="#956ddf" stroke-width="1.5"/><g fill="#a77af4"><rect x="43" y="50" width="9" height="8" rx="2"/><rect x="62" y="50" width="9" height="8" rx="2"/><rect x="43" y="64" width="9" height="8" rx="2"/><rect x="62" y="64" width="9" height="8" rx="2"/></g><g fill="#c0a2ff"><rect x="112" y="35" width="12" height="9" rx="2"/><rect x="135" y="35" width="12" height="9" rx="2"/><rect x="158" y="35" width="12" height="9" rx="2"/><rect x="112" y="53" width="12" height="9" rx="2"/><rect x="135" y="53" width="12" height="9" rx="2"/><rect x="158" y="53" width="12" height="9" rx="2"/></g><rect x="127" y="67" width="24" height="13" rx="3" fill="url(#pg1)"/><path d="M22 81h176" stroke="#6c538e" stroke-width="2"/></svg>`,
        bi: `<svg viewBox="0 0 220 100" aria-hidden="true"><defs><linearGradient id="bg1" x1="0" x2="1"><stop stop-color="#d45472"/><stop offset="1" stop-color="#ff8ca4"/></linearGradient></defs><rect x="9" y="8" width="202" height="84" rx="20" fill="#321d27"/><rect x="24" y="20" width="172" height="62" rx="10" fill="#21141b" stroke="#754052"/><path d="M39 68V53h24v15M78 68V39h24v29M117 68V29h24v39" fill="url(#bg1)" opacity=".88"/><path d="M39 43l34-13 35 8 43-17 28 7" fill="none" stroke="#ff9fb4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g fill="#ffd2dc"><circle cx="39" cy="43" r="4"/><circle cx="73" cy="30" r="4"/><circle cx="108" cy="38" r="4"/><circle cx="151" cy="21" r="4"/><circle cx="179" cy="28" r="4"/></g><rect x="155" y="48" width="26" height="6" rx="3" fill="#613243"/><rect x="155" y="60" width="20" height="6" rx="3" fill="#613243"/></svg>`
    };
    return scenes[key] || '';
}
function populateAreaOptions(selected = 'Service Desk') { const opts = AREAS.map(a => `<option value="${a.name}"${a.name === selected ? ' selected' : ''}>${a.name}</option>`).join(''); $('ticketArea').innerHTML = opts; if ($('myAreaFilter')) {
    $('myAreaFilter').innerHTML = '<option value="all">Todas as áreas</option>' + AREAS.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
    $('myAreaFilter').value = myAreaFilter;
} }
function renderAreas() { $('areaGrid').innerHTML = AREAS.map(a => `<article class="area-card" data-area="${a.name}"><div class="area-visual">${areaIllustration(a.key)}</div><div class="area-body"><div class="area-title-row"><h3>${a.name}</h3><span class="area-arrow">↗</span></div><p>${a.desc}</p><div class="area-meta"><b>${a.services.length}</b> serviços disponíveis</div></div></article>`).join(''); $$('.area-card').forEach(c => c.onclick = () => openTicket(c.dataset.area)); $('catalogGrid').innerHTML = AREAS.map(a => `<article class="catalog-area card"><h3>${a.name}</h3><p>${a.desc}</p><div class="service-list">${a.services.map(s => `<div class="service-item"><span>${s}</span><span>Ativo</span></div>`).join('')}</div></article>`).join(''); $('areaFilter').innerHTML = '<option value="all">Todas as áreas</option>' + AREAS.map(a => `<option>${a.name}</option>`).join(''); populateAreaOptions(); updateServiceOptions(); }

/* =========================================================
   Chamados do solicitante e painel administrativo
   ========================================================= */
function requesterTickets() { return tickets.filter(t => t.email === 'solicitante@r2desk.com'); }
function ticketCard(t) { return `<article class="ticket-card card" data-ticket="${t.id}"><div class="ticket-top"><span class="ticket-id">${t.id}</span><span class="badge ${statusClass(t.status)}">${t.status}</span></div><h3>${esc(t.subject)}</h3><p>${t.area} • ${t.service}</p><div class="ticket-foot"><span>Prioridade: <b class="${prioClass(t.priority)}">${t.priority}</b></span><span>SLA: ${t.sla}</span></div></article>`; }
function recentRow(t) { return `<div class="recent-row" data-ticket="${t.id}"><span class="rid">${t.id}</span><div class="rsubject"><b>${esc(t.subject)}</b><span>${t.area} • ${t.service}</span></div><div class="rcell hide-sm">${t.created}</div><div class="hide-md"><span class="badge ${statusClass(t.status)}">${t.status}</span></div><div class="rcell hide-sm">SLA ${t.sla}</div><span class="go">→</span></div>`; }
function ticketDateISO(created) { const m = String(created || '').match(/^(\d{2})\/(\d{2})\/(\d{4})/); return m ? `${m[3]}-${m[2]}-${m[1]}` : ''; }
function filteredRequesterTickets() { return requesterTickets().filter(t => { const d = ticketDateISO(t.created); return (myAreaFilter === 'all' || t.area === myAreaFilter) && (!myDateFrom || d >= myDateFrom) && (!myDateTo || d <= myDateTo); }); }
function renderRequester() { const own = requesterTickets(), filtered = filteredRequesterTickets(); $('requesterTicketCount').textContent = `${own.length} registrado(s)`; $('myTicketCards').innerHTML = filtered.map(ticketCard).join('') || '<div class="card empty">Nenhum chamado encontrado com os filtros selecionados.</div>'; if ($('myTicketFilterResult'))
    $('myTicketFilterResult').textContent = `Exibindo ${filtered.length} de ${own.length} chamado(s)`; $('portalTickets').innerHTML = own.slice(0, 4).map(recentRow).join('') || '<div class="empty">Você ainda não possui chamados.</div>'; $('sumOpen').textContent = own.filter(t => t.status === 'Aberto').length; $('sumProgress').textContent = own.filter(t => t.status === 'Em atendimento').length; $('sumWait').textContent = own.filter(t => t.status === 'Aguardando usuário').length; bindTicketClicks(); }
function queueRow(t) { return `<tr data-ticket="${t.id}"><td><b style="color:var(--brand)">${t.id}</b></td><td>${esc(t.subject)}</td><td>${esc(t.requester)}</td><td>${t.area}</td><td class="${prioClass(t.priority)}">${t.priority}</td><td><span class="badge ${statusClass(t.status)}">${t.status}</span></td><td>${t.sla}</td></tr>`; }
function renderAdmin() { const active = tickets.filter(t => t.status !== 'Resolvido'); $('mOpen').textContent = active.length; $('mRisk').textContent = active.filter(t => ['Alta', 'Crítica'].includes(t.priority)).length; $('mDone').textContent = tickets.filter(t => t.status === 'Resolvido').length; $('recentAdminRows').innerHTML = tickets.slice(0, 5).map(t => `<tr data-ticket="${t.id}"><td><b>${t.id}</b></td><td>${esc(t.subject)}</td><td>${t.area}</td><td class="${prioClass(t.priority)}">${t.priority}</td><td><span class="badge ${statusClass(t.status)}">${t.status}</span></td></tr>`).join(''); $('areaHealth').innerHTML = AREAS.map(a => { const n = active.filter(t => t.area === a.name).length, p = Math.min(100, Math.max(10, n * 22)); return `<div class="health-row"><b>${a.name}</b><span>${n} ativo(s)</span><div class="progress"><i style="--w:${p}%"></i></div></div>`; }).join(''); $('rTotal').textContent = tickets.length; $('rProgress').textContent = tickets.filter(t => t.status === 'Em atendimento').length; $('rSolved').textContent = tickets.filter(t => t.status === 'Resolvido').length; $('rHigh').textContent = tickets.filter(t => ['Alta', 'Crítica'].includes(t.priority)).length; renderQueue(); bindTicketClicks(); }
function renderQueue() { const q = ($('globalSearch').value || '').toLowerCase(); const list = tickets.filter(t => statusFilter === 'all' || t.status === statusFilter).filter(t => areaFilter === 'all' || t.area === areaFilter).filter(t => Object.values(t).join(' ').toLowerCase().includes(q)); $('queueRows').innerHTML = list.map(queueRow).join('') || '<tr><td colspan="7" class="empty">Nenhum chamado encontrado.</td></tr>'; bindTicketClicks(); }
function renderAll() { renderAreas(); renderRequester(); renderAdmin(); renderKnowledge(); renderNotifications(); }

/* =========================================================
   Base de conhecimento
   ========================================================= */
function renderKnowledge() { const q = ($('knowledgeSearch')?.value || '').toLowerCase(); const categories = ['Todos', ...AREAS.map(a => a.name)]; $('knowledgeFilters').innerHTML = categories.map(c => `<button class="chip ${knowledgeFilter === c ? 'active' : ''}" data-kfilter="${c}">${c}</button>`).join(''); const list = ARTICLES.filter(a => knowledgeFilter === 'Todos' || a.area === knowledgeFilter).filter(a => (a.title + ' ' + a.summary + ' ' + a.area + ' ' + a.service).toLowerCase().includes(q)); $('articleGrid').innerHTML = list.map(a => `<article class="article card" data-article="${a.id}"><div class="tag">${a.area}</div><h3>${a.title}</h3><p>${a.summary}</p><footer><span>${a.time} de leitura</span><b>Ler artigo →</b></footer></article>`).join('') || '<div class="card empty">Nenhum artigo encontrado.</div>'; $$('[data-kfilter]').forEach(b => b.onclick = () => { knowledgeFilter = b.dataset.kfilter; renderKnowledge(); }); $$('[data-article]').forEach(c => c.onclick = () => openArticle(c.dataset.article)); }
function openArticle(id) { const a = ARTICLES.find(x => x.id === id); if (!a)
    return; $('articleDetailContent').innerHTML = `<button class="back-link" data-page-target="knowledge">← Voltar para a base</button><div class="article-page"><article class="article-content card"><div class="tag">${a.area}</div><h1>${a.title}</h1><p class="article-lead">${a.lead}</p><div class="article-note"><b>Tempo estimado:</b> ${a.time}. Siga os passos abaixo antes de abrir um chamado.</div><h3>Passo a passo</h3><ol>${a.steps.map(s => `<li>${s}</li>`).join('')}</ol><h3>Quando abrir um chamado?</h3><p>${a.note}</p></article><aside class="article-aside card"><h3>Ações relacionadas</h3><button class="aside-action" id="articleOpenTicket">Ainda preciso de ajuda → abrir chamado</button><button class="aside-action" data-page-target="knowledge">Ver outros artigos</button><div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:8px;color:var(--muted)">Área responsável<br><b style="color:var(--text);font-size:10px">${a.area}</b><br><br>Serviço<br><b style="color:var(--text);font-size:10px">${a.service}</b></div></aside></div>`; goPage('articleDetail'); bindPageTargets(); $('articleOpenTicket').onclick = () => openTicket(a.area, a.title, a.service); }

/* =========================================================
   Abertura de chamado - fluxo em três etapas
   ========================================================= */
function openTicket(area = 'Service Desk', prefill = '', service = '') { wizardStep = 1; selectedIssue = 'Incidente'; selectedUrgency = 'Normal'; selectedFiles = []; const selectedArea = AREAS.some(a => a.name === area) ? area : 'Service Desk'; populateAreaOptions(selectedArea); $('ticketArea').value = selectedArea; updateServiceOptions(service); $('ticketSubject').value = prefill; $('ticketDescription').value = ''; $$('.issue-option').forEach((x, i) => x.classList.toggle('selected', i === 0)); $$('.urgency').forEach((x, i) => x.classList.toggle('selected', i === 0)); renderFiles(); renderWizard(); $('ticketModal').classList.add('open'); }
function closeTicket() { $('ticketModal').classList.remove('open'); }
function updateServiceOptions(preselect = '') { const area = AREAS.find(a => a.name === $('ticketArea').value) || AREAS[0]; $('ticketService').innerHTML = area.services.map(s => `<option value="${s}"${s === preselect ? ' selected' : ''}>${s}</option>`).join(''); if (preselect && area.services.includes(preselect))
    $('ticketService').value = preselect; }
function renderWizard() { $$('.wizard-page').forEach(p => p.classList.toggle('active', +p.dataset.step === wizardStep)); $$('.step').forEach(s => { const n = +s.dataset.stepInd; s.classList.toggle('active', n === wizardStep); s.classList.toggle('done', n < wizardStep); }); $('wizardBack').classList.toggle('hidden', wizardStep === 1); $('wizardNext').classList.toggle('hidden', wizardStep === 3); $('wizardSubmit').classList.toggle('hidden', wizardStep !== 3); if (wizardStep === 3)
    buildReview(); }
function calcPriority() { if (selectedUrgency === 'Imediata')
    return 'Crítica'; if (selectedUrgency === 'Alta')
    return 'Alta'; if (selectedIssue === 'Incidente')
    return 'Média'; return 'Baixa'; }
function calcSla(p) { return p === 'Crítica' ? '1h' : p === 'Alta' ? '4h' : p === 'Média' ? '8h' : '24h'; }
function humanSize(bytes) { if (bytes >= 1073741824)
    return (bytes / 1073741824).toFixed(2) + ' GB'; if (bytes >= 1048576)
    return (bytes / 1048576).toFixed(1) + ' MB'; if (bytes >= 1024)
    return (bytes / 1024).toFixed(1) + ' KB'; return bytes + ' B'; }
function renderFiles() { $('fileList').innerHTML = selectedFiles.map((f, i) => `<div class="file-item"><span><b>${esc(f.name)}</b><br><span class="muted">${humanSize(f.size)}</span></span><button type="button" data-remove-file="${i}">×</button></div>`).join(''); $$('[data-remove-file]').forEach(b => b.onclick = () => { selectedFiles.splice(+b.dataset.removeFile, 1); renderFiles(); }); }
function buildReview() { const p = calcPriority(), files = selectedFiles.length ? selectedFiles.map(f => `${esc(f.name)} (${humanSize(f.size)})`).join('<br>') : 'Nenhum anexo'; $('ticketReview').innerHTML = `<div class="review-section"><strong>1. Direcionamento</strong><div class="review-kv"><span>Área</span><span>${$('ticketArea').value}</span><span>Serviço</span><span>${$('ticketService').value}</span><span>Tipo</span><span>${selectedIssue}</span></div></div><div class="review-section"><strong>2. O que será informado à TI</strong><div class="review-kv"><span>Assunto</span><span>${esc($('ticketSubject').value)}</span><span>Descrição</span><span>${esc($('ticketDescription').value).replace(/\n/g, '<br>')}</span><span>Urgência</span><span>${selectedUrgency}</span><span>Anexos</span><span>${files}</span></div></div><div class="review-section"><strong>3. Atendimento inicial</strong><div class="review-kv"><span>Prioridade estimada</span><span class="${prioClass(p)}">${p}</span><span>SLA inicial</span><span>${calcSla(p)}</span><span>Fila</span><span>${$('ticketArea').value}</span></div></div><div class="review-confirm"><b>Antes de enviar:</b> confirme que a descrição não contém senhas, códigos de MFA ou informações confidenciais desnecessárias. Depois do envio, você poderá conversar com a equipe de TI e complementar o chamado pela página de acompanhamento.</div>`; }

/* =========================================================
   Detalhes do chamado e interação Solicitante x TI
   ========================================================= */
function openTicketDetail(id) { const t = tickets.find(x => x.id === id); if (!t)
    return; currentTicketId = id; const attachments = t.attachments?.length ? t.attachments.map(f => `<div class="attachment-chip"><span><b>${esc(f.name)}</b><br><span class="muted">${humanSize(f.size || 0)}</span></span><span>Arquivo</span></div>`).join('') : '<div class="muted" style="font-size:9px">Nenhum anexo enviado.</div>'; const messages = (t.messages || []).map(m => `<div class="message ${m.role === role ? 'mine' : ''} ${m.role === 'admin' ? 'support' : ''}"><div class="message-avatar">${m.role === 'admin' ? 'TI' : initials(m.author)}</div><div class="bubble"><b>${esc(m.author)}</b><p>${esc(m.text)}</p><small>${esc(m.at)}</small></div></div>`).join('') || '<div class="empty">Ainda não há interações neste chamado.</div>'; const adminActions = role === 'admin' ? `<div class="side-section card"><h3>Atendimento</h3><div class="admin-action-grid"><div class="field"><label>Status</label><select id="detailStatus"><option${t.status === 'Aberto' ? ' selected' : ''}>Aberto</option><option${t.status === 'Em atendimento' ? ' selected' : ''}>Em atendimento</option><option${t.status === 'Aguardando usuário' ? ' selected' : ''}>Aguardando usuário</option><option${t.status === 'Resolvido' ? ' selected' : ''}>Resolvido</option></select></div><div class="field"><label>Responsável</label><select id="detailOwner"><option${t.owner === 'Não atribuído' ? ' selected' : ''}>Não atribuído</option><option${t.owner === 'Kevin Santos' ? ' selected' : ''}>Kevin Santos</option><option${t.owner === 'Ana Costa' ? ' selected' : ''}>Ana Costa</option><option${t.owner === 'Lucas Rocha' ? ' selected' : ''}>Lucas Rocha</option><option${t.owner === 'Carla Mendes' ? ' selected' : ''}>Carla Mendes</option><option${t.owner === 'Marcelo Alves' ? ' selected' : ''}>Marcelo Alves</option></select></div></div><button class="btn btn-primary btn-block" id="saveTicketAdmin" style="margin-top:9px">Salvar atendimento</button></div>` : ''; $('ticketDetailContent').innerHTML = `<div class="ticket-detail-head"><div><button class="back-link" id="backFromTicket">← Voltar</button><h1>${esc(t.subject)}</h1><div class="meta-line">${t.id} • aberto em ${t.created} por ${esc(t.requester)}</div></div><div style="display:flex;gap:7px;align-items:center"><span class="badge ${statusClass(t.status)}">${t.status}</span><span class="badge" style="background:var(--panel2);color:var(--text)">${t.area}</span></div></div><div class="ticket-detail-grid"><div class="conversation-card card"><div class="conversation-head"><h3>Conversa do chamado</h3><span>${(t.messages || []).length} interação(ões)</span></div><div class="thread">${messages}</div><div class="reply-box"><textarea id="ticketReply" placeholder="${role === 'admin' ? 'Escreva uma atualização para o solicitante...' : 'Ex.: Bom dia! Alguma novidade sobre o meu chamado?'}"></textarea><div class="reply-actions"><span>As mensagens ficam registradas no histórico do chamado.</span><button class="btn btn-primary" id="sendReply">Enviar mensagem</button></div></div></div><aside class="ticket-side"><div class="side-section card"><h3>Resumo do chamado</h3><div class="detail-kv"><span>Status</span><span><span class="badge ${statusClass(t.status)}">${t.status}</span></span><span>Prioridade</span><span class="${prioClass(t.priority)}">${t.priority}</span><span>SLA</span><span>${t.sla}</span><span>Área</span><span>${t.area}</span><span>Serviço</span><span>${t.service}</span><span>Responsável</span><span>${t.owner}</span></div></div>${adminActions}<div class="side-section card"><h3>Descrição inicial</h3><p style="font-size:9px;line-height:1.6;margin:0">${esc(t.description)}</p></div><div class="side-section card"><h3>Anexos</h3>${attachments}</div><div class="side-section card"><h3>Histórico</h3><div class="timeline"><div class="event"><b>Chamado registrado</b><p>${t.created}</p></div><div class="event"><b>Direcionado para ${t.group}</b><p>Classificação pelo catálogo.</p></div>${t.status !== 'Aberto' ? `<div class="event"><b>Status: ${t.status}</b><p>Última situação registrada.</p></div>` : ''}</div></div></aside></div>`; goPage('ticketDetail'); $('backFromTicket').onclick = () => goPage(role === 'admin' ? 'queue' : 'myTickets'); $('sendReply').onclick = () => { const text = $('ticketReply').value.trim(); if (!text) {
    toast('Escreva uma mensagem antes de enviar.');
    return;
} t.messages = t.messages || []; t.messages.push({ author: role === 'admin' ? 'Equipe de TI' : 'Kevin Santos', role: role === 'admin' ? 'admin' : 'requester', at: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), text }); if (role === 'admin' && t.email === 'solicitante@r2desk.com')
    addNotification({ type: 'ticket', ticketId: t.id, title: 'Nova atualização no chamado', text: `${t.id} • A equipe de TI enviou uma nova mensagem.` }); if (role === 'requester' && t.status === 'Aguardando usuário')
    t.status = 'Em atendimento'; save(); renderAll(); openTicketDetail(id); toast('Mensagem adicionada ao chamado.'); }; if (role === 'admin')
    $('saveTicketAdmin').onclick = () => { const previousStatus = t.status; t.status = $('detailStatus').value; t.owner = $('detailOwner').value; if (t.status === 'Resolvido')
        t.sla = 'Concluído'; if (previousStatus !== 'Resolvido' && t.status === 'Resolvido' && t.email === 'solicitante@r2desk.com')
        addNotification({ type: 'ticket', ticketId: t.id, title: 'Seu chamado foi resolvido', text: `${t.id} • ${t.subject} foi marcado como resolvido.` }); save(); renderAll(); openTicketDetail(id); toast('Atendimento atualizado.'); }; }
function initials(name) { return String(name || 'U').split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase(); }
function bindTicketClicks() { $$('[data-ticket]').forEach(x => x.onclick = () => openTicketDetail(x.dataset.ticket)); }
function bindPageTargets() { $$('[data-page-target]').forEach(b => b.onclick = () => goPage(b.dataset.pageTarget)); }
$$('.login-tab').forEach(tab => tab.onclick = () => { loginRole = tab.dataset.loginRole; $$('.login-tab').forEach(x => x.classList.toggle('active', x === tab)); if (loginRole === 'admin') {
    $('loginEmail').value = 'admin@r2desk.com';
    $('loginPassword').value = 'admin123';
    $('demoBox').innerHTML = '<b>Conta de demonstração — Administrador</b><br>admin@r2desk.com<br>Senha: admin123';
}
else {
    $('loginEmail').value = 'solicitante@r2desk.com';
    $('loginPassword').value = '123456';
    $('demoBox').innerHTML = '<b>Conta de demonstração — Solicitante</b><br>solicitante@r2desk.com<br>Senha: 123456';
} });

/* =========================================================
   Login demonstrativo e sessão do protótipo
   ========================================================= */
$('loginForm').onsubmit = e => { e.preventDefault(); const em = $('loginEmail').value.trim().toLowerCase(), pw = $('loginPassword').value; const ok = loginRole === 'admin' ? (em === 'admin@r2desk.com' && pw === 'admin123') : (em === 'solicitante@r2desk.com' && pw === '123456'); if (!ok) {
    $('loginError').classList.add('show');
    return;
} $('loginError').classList.remove('show'); role = loginRole; sessionStorage.setItem('r2deskRole', role); enterApp(); };
function enterApp() { $('loginScreen').classList.add('hidden'); $('app').classList.remove('hidden'); const admin = role === 'admin'; $('navRequester').classList.toggle('hidden', admin); $('navAdmin').classList.toggle('hidden', !admin); $('notificationWrap').classList.toggle('hidden', admin); $('sideName').textContent = admin ? 'Administrador R2Desk' : 'Kevin Santos'; $('sideRole').textContent = admin ? 'Administrador' : 'Solicitante'; $('sideAvatar').textContent = admin ? 'AD' : 'KS'; $('topNewTicket').textContent = admin ? '+ Registrar chamado' : '+ Novo chamado'; renderAll(); bindPageTargets(); goPage(admin ? 'adminDashboard' : 'portal'); }
$('logoutBtn').onclick = () => { $('logoutModal').classList.add('open'); };
$('cancelLogout').onclick = () => { $('logoutModal').classList.remove('open'); };
$('confirmLogout').onclick = () => { sessionStorage.removeItem('r2deskRole'); $('logoutModal').classList.remove('open'); $('notificationPanel').classList.remove('open'); $('app').classList.add('hidden'); $('loginScreen').classList.remove('hidden'); };
$('logoutModal').onclick = e => { if (e.target === $('logoutModal'))
    $('logoutModal').classList.remove('open'); };
$$('.nav button[data-page]').forEach(b => b.onclick = () => goPage(b.dataset.page));

/* =========================================================
   Eventos da interface e formulário de chamados
   ========================================================= */
$('topNewTicket').onclick = () => openTicket();
$('heroOpenTicket').onclick = () => openTicket('Service Desk', $('serviceSearch').value.trim());
$$('[data-new-ticket]').forEach(b => b.onclick = () => openTicket());
$$('.quick-action').forEach(c => c.onclick = () => { const q = c.dataset.quick; if (q === 'Problema no notebook')
    openTicket('Help Desk', q, 'Notebook / Desktop');
else if (q === 'Relatório / BI')
    openTicket('BI', q, 'Power BI');
else if (q === 'Acesso a sistema')
    openTicket('Service Desk', q, 'Acessos e permissões');
else
    openTicket('Service Desk', q, 'Senha e desbloqueio'); });
$('ticketArea').onchange = () => updateServiceOptions();
$('issueGrid').onclick = e => { const o = e.target.closest('.issue-option'); if (!o)
    return; selectedIssue = o.dataset.issue; $$('.issue-option').forEach(x => x.classList.toggle('selected', x === o)); };
$('urgencyRow').onclick = e => { const b = e.target.closest('.urgency'); if (!b)
    return; selectedUrgency = b.dataset.urgency; $$('.urgency').forEach(x => x.classList.toggle('selected', x === b)); };
$('chooseFiles').onclick = () => $('ticketFiles').click();
$('ticketFiles').onchange = e => { const incoming = Array.from(e.target.files || []); const allowed = incoming.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/') || f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')); if (allowed.length !== incoming.length)
    toast('Alguns arquivos foram ignorados. Use imagem, vídeo ou PDF.'); const merged = [...selectedFiles, ...allowed], total = merged.reduce((s, f) => s + f.size, 0); if (total > 2 * 1024 * 1024 * 1024) {
    toast('O limite total de anexos é 2 GB.');
    e.target.value = '';
    return;
} selectedFiles = merged; renderFiles(); e.target.value = ''; };
$('wizardBack').onclick = () => { if (wizardStep > 1) {
    wizardStep--;
    renderWizard();
} };
$('wizardNext').onclick = () => { if (wizardStep === 1) {
    wizardStep = 2;
    renderWizard();
    return;
} if (wizardStep === 2) {
    if (!$('ticketSubject').value.trim() || !$('ticketDescription').value.trim()) {
        toast('Preencha assunto e descrição para continuar.');
        return;
    }
    wizardStep = 3;
    renderWizard();
} };
$('wizardCancel').onclick = closeTicket;
$('closeTicketModal').onclick = closeTicket;
$('ticketModal').onclick = e => { if (e.target === $('ticketModal'))
    closeTicket(); };
function createTicketFromWizard() { const area = $('ticketArea').value, service = $('ticketService').value, subject = $('ticketSubject').value.trim(), description = $('ticketDescription').value.trim(); if (!area || !AREAS.some(a => a.name === area)) {
    wizardStep = 1;
    renderWizard();
    toast('Selecione a área de atendimento.');
    return;
} if (!service) {
    wizardStep = 1;
    renderWizard();
    toast('Selecione o serviço.');
    return;
} if (!subject || !description) {
    wizardStep = 2;
    renderWizard();
    toast('Preencha assunto e descrição.');
    return;
} const max = Math.max(...tickets.map(t => parseInt(t.id.replace(/\D/g, '')) || 0), 1084) + 1, p = calcPriority(), created = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); const t = { id: `INC-${max}`, subject, requester: role === 'admin' ? 'Administrador R2Desk' : 'Kevin Santos', email: role === 'admin' ? 'admin@r2desk.com' : 'solicitante@r2desk.com', area, service, type: selectedIssue, priority: p, urgency: selectedUrgency, status: 'Aberto', owner: 'Não atribuído', group: area, sla: calcSla(p), created, description, attachments: selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })), messages: [{ author: role === 'admin' ? 'Administrador R2Desk' : 'Kevin Santos', role: role === 'admin' ? 'admin' : 'requester', at: created, text: description }] }; tickets.unshift(t); save(); closeTicket(); renderAll(); toast(`${t.id} criado com sucesso.`); openTicketDetail(t.id); }
$('ticketForm').onsubmit = e => { e.preventDefault(); createTicketFromWizard(); };
$('statusFilters').onclick = e => { const b = e.target.closest('[data-filter]'); if (!b)
    return; statusFilter = b.dataset.filter; $$('#statusFilters .chip').forEach(x => x.classList.toggle('active', x === b)); renderQueue(); };
$('areaFilter').onchange = e => { areaFilter = e.target.value; renderQueue(); };
$('globalSearch').oninput = renderQueue;
if ($('knowledgeSearch'))
    $('knowledgeSearch').oninput = renderKnowledge;
$('myAreaFilter').onchange = e => { myAreaFilter = e.target.value; renderRequester(); };
$('myDateFrom').onchange = e => { myDateFrom = e.target.value; renderRequester(); };
$('myDateTo').onchange = e => { myDateTo = e.target.value; renderRequester(); };
$('clearMyTicketFilters').onclick = () => { myAreaFilter = 'all'; myDateFrom = ''; myDateTo = ''; $('myAreaFilter').value = 'all'; $('myDateFrom').value = ''; $('myDateTo').value = ''; renderRequester(); };
$('notificationBtn').onclick = e => { e.stopPropagation(); const open = !$('notificationPanel').classList.contains('open'); $('notificationPanel').classList.toggle('open', open); $('notificationBtn').classList.toggle('active', open); };
$('markNotificationsRead').onclick = e => { e.stopPropagation(); notifications = notifications.map(n => ({ ...n, read: true })); saveNotifications(); renderNotifications(); };
$('notificationPanel').onclick = e => e.stopPropagation();
document.addEventListener('click', () => { $('notificationPanel').classList.remove('open'); $('notificationBtn').classList.remove('active'); });

/* =========================================================
   Tema e inicialização da aplicação
   ========================================================= */
function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem('r2deskTheme', theme); }
$$('.theme-toggle').forEach(btn => btn.onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') {
    closeTicket();
    $('logoutModal').classList.remove('open');
    $('notificationPanel').classList.remove('open');
    $('notificationBtn').classList.remove('active');
} });
renderAreas();
renderKnowledge();
bindPageTargets();
const savedRole = sessionStorage.getItem('r2deskRole');
if (savedRole) {
    role = savedRole;
    enterApp();
}
