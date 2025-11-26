import React, { useEffect, useState, useMemo } from 'react';
import { listTickets, patchTicket } from '../api.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../components/Toast.jsx';
import Spinner from '../components/Spinner.jsx';

const COLS = [
  { key: 'open',        title: 'Open',        colorVar: '--ok' },
  { key: 'in_progress', title: 'In Progress', colorVar: '--warn' },
  { key: 'review',      title: 'Review',      colorVar: '--brand' },
  { key: 'closed',      title: 'Closed',      colorVar: '--danger' }
];

function TicketCard({ t }){
  const dragStart = (e) => {
    e.dataTransfer.setData('text/plain', t.id);
    e.dataTransfer.effectAllowed = 'move';
    document.body.classList.add('dragging');
  };
  const dragEnd = () => {
    document.body.classList.remove('dragging');
  };
  
  const handleKeyDown = (e, currentStatus) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const statusOrder = ['open', 'in_progress', 'review', 'closed'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      if (e.key === 'Enter' && currentIndex < statusOrder.length - 1) {
        // Move to next status on Enter
        const event = new Event('moveCard');
        event.ticketId = t.id;
        event.newStatus = statusOrder[currentIndex + 1];
        window.dispatchEvent(event);
      }
    }
  };
  
  return (
    <div
      draggable
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      tabIndex={0}
      role="button"
      aria-label={`${t.title}. Status: ${t.status}. Priority: ${t.priority}. Press Enter to move to next status.`}
      onKeyDown={(e) => handleKeyDown(e, t.status)}
      className="card"
      style={{ padding:12, marginBottom:10, cursor:'grab' }}
    >
      <div style={{fontWeight:700, marginBottom:4}}>{t.title}</div>
      <div className="small">{t.description}</div>
      <div className="small" style={{marginTop:6}}>
        <b>Priority:</b> {t.priority} &nbsp; | &nbsp; <b>Assignee:</b> {t.assignee || '-'}
      </div>
    </div>
  );
}

function buildSeries(tickets){
  const arr = [...tickets].sort((a,b)=> new Date(a.updatedAt) - new Date(b.updatedAt));
  const MAX_POINTS = 60;
  let sampled = arr;
  if (arr.length > MAX_POINTS) {
    const step = arr.length / MAX_POINTS;
    sampled = Array.from({length: MAX_POINTS}, (_,i)=> arr[Math.floor(i*step)]);
  }
  let open=0, prog=0, rev=0, closed=0;
  const sOpen=[], sProg=[], sRev=[], sClosed=[], sTotal=[];
  for (const t of sampled){
    if (t.status === 'open') open++;
    else if (t.status === 'in_progress') prog++;
    else if (t.status === 'review') rev++;
    else if (t.status === 'closed') closed++;
    sOpen.push(open); sProg.push(prog); sRev.push(rev); sClosed.push(closed);
    sTotal.push(open+prog+rev+closed);
  }
  return { sOpen, sProg, sRev, sClosed, sTotal };
}

function areaPath(lower, upper, width, height, maxY){
  const n = upper.length;
  if (!n || maxY === 0) return '';
  const stepX = width / Math.max(1, n-1);
  const yScale = (v) => height - (v / maxY) * height;

  let d = '';
  for (let i=0; i<n; i++){
    const x = i * stepX;
    const y = yScale(upper[i]);
    d += (i===0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }
  for (let i=n-1; i>=0; i--){
    const x = i * stepX;
    const y = yScale(lower[i]);
    d += ` L ${x} ${y}`;
  }
  return d + ' Z';
}

function LegendDot({ label, colorVar }){
  const style = { width:10, height:10, borderRadius:2, background:`var(${colorVar})`, display:'inline-block', marginRight:8 };
  return <div className="small" style={{display:'flex', alignItems:'center', gap:6}}>
    <span style={style} aria-hidden="true" /> {label}
  </div>;
}

function StackedArea({ tickets }){
  const PAD = { t:12, r:12, b:24, l:36 };
  const width = 880, height = 180;

  const { sOpen, sProg, sRev, sClosed, sTotal } = useMemo(()=> buildSeries(tickets), [tickets]);
  const maxY = sTotal.reduce((m,v)=> Math.max(m,v), 0);

  const upperOpen   = sOpen;
  const lowerOpen   = sOpen.map(_ => 0);
  const upperProg   = sProg.map((v,i)=> v + sOpen[i]);
  const lowerProg   = [...sOpen];
  const upperRev    = sRev.map((v,i)=> v + sOpen[i] + sProg[i]);
  const lowerRev    = sOpen.map((v,i)=> v + sProg[i]);
  const upperClosed = sClosed.map((v,i)=> v + sOpen[i] + sProg[i] + sRev[i]);
  const lowerClosed = sOpen.map((v,i)=> v + sProg[i] + sRev[i]);

  const grid = Array.from({length:5}, (_,i)=> Math.round((maxY*(i+1))/5));

  return (
    <div className="card" style={{marginBottom:16}}>
      <div className="card-body">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <div style={{fontWeight:700}}>Overview</div>
          <div style={{display:'flex', gap:12}}>
            <LegendDot label="Open"        colorVar="--ok" />
            <LegendDot label="In Progress" colorVar="--warn" />
            <LegendDot label="Review"      colorVar="--brand" />
            <LegendDot label="Closed"      colorVar="--danger" />
          </div>
        </div>

        <div style={{overflowX:'auto'}}>
          <svg width={width + PAD.l + PAD.r} height={height + PAD.t + PAD.b} role="img" aria-label="Stacked area of ticket stages over time">
            <g transform={`translate(${PAD.l},${PAD.t})`}>
              {grid.map((val,i)=> {
                const y = height - (val / (maxY||1)) * height;
                return (
                  <g key={i}>
                    <line x1={0} y1={y} x2={width} y2={y} stroke="var(--border)" strokeWidth="1" />
                    <text x={-8} y={y} textAnchor="end" alignmentBaseline="middle" fontSize="11" fill="var(--muted)">{val}</text>
                  </g>
                );
              })}
              <path d={areaPath(lowerClosed, upperClosed, width, height, maxY)} fill="var(--danger)" opacity="0.75" />
              <path d={areaPath(lowerRev,    upperRev,    width, height, maxY)} fill="var(--brand)"  opacity="0.75" />
              <path d={areaPath(lowerProg,   upperProg,   width, height, maxY)} fill="var(--warn)"   opacity="0.75" />
              <path d={areaPath(lowerOpen,   upperOpen,   width, height, maxY)} fill="var(--ok)"     opacity="0.85" />
              <line x1={0} y1={height} x2={width} y2={height} stroke="var(--border)" strokeWidth="1" />
            </g>
          </svg>
        </div>
        <div className="small" style={{marginTop:6}}>
          Tip: Graph is built from tickets over time (sorted by last update). Dragging cards will shift the trend after refresh.
        </div>
      </div>
    </div>
  );
}

export default function Kanban(){
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const toast = useToast();

  const debouncedQ = useDebounce(q, 300);

  async function load(){
    setLoading(true);
    const res = await listTickets({ pageSize: 500 });
    setTickets(res.data);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, []);
  
  useEffect(() => {
    const handleMoveCard = async (e) => {
      const { ticketId, newStatus } = e;
      const oldTickets = [...tickets];
      setTickets(ts => ts.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
      try {
        await patchTicket(ticketId, { status: newStatus });
        toast.success('Card moved successfully!');
      } catch {
        setTickets(oldTickets);
        toast.error('Failed to move card');
      }
    };
    window.addEventListener('moveCard', handleMoveCard);
    return () => window.removeEventListener('moveCard', handleMoveCard);
  }, [tickets, toast]);

  const filtered = useMemo(() => {
    const s = debouncedQ.trim().toLowerCase();
    if (!s) return tickets;
    return tickets.filter(t =>
      t.title.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      (t.assignee || '').toLowerCase().includes(s)
    );
  }, [tickets, debouncedQ]);

  const total = filtered.length;

  async function onDropStatus(e, newStatus){
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    const oldTickets = [...tickets];
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await patchTicket(id, { status: newStatus });
      toast.success('Card moved successfully!');
    } catch {
      setTickets(oldTickets);
      toast.error('Failed to move card');
    } finally {
      document.body.classList.remove('dragging');
    }
  }
  const onDragOver = (e) => e.preventDefault();
  const byStatus = (status) => filtered.filter(t => t.status === status);

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-body" style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <input className="input" placeholder="Search cards…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn btn-outline" onClick={load}>Reload</button>
          <div className="small" style={{marginLeft:'auto'}}>Total: {total}</div>
        </div>
      </div>

      <StackedArea tickets={filtered} />

      {loading ? <div style={{display:'flex', alignItems:'center', gap:10, padding:20}}><Spinner /><span>Loading tickets...</span></div> :
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}}>
        {COLS.map(col => (
          <div key={col.key} className="card" style={{minHeight: 400}}>
            <div className="card-header" id={`column-${col.key}`}>{col.title}</div>
            <div
              className="card-body"
              style={{minHeight: 360}}
              role="region"
              aria-labelledby={`column-${col.key}`}
              onDragOver={onDragOver}
              onDrop={(e)=>onDropStatus(e, col.key)}
            >
              {byStatus(col.key).map(t => <TicketCard key={t.id} t={t} />)}
              {byStatus(col.key).length === 0 && <div className="small" style={{opacity:.8}}>Drop cards here</div>}
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}
