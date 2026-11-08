import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, Bell, CalendarDays, Check, CheckCircle2, ChevronDown,
  Circle, ClipboardList, Clock3, Droplets, Flame, Leaf, Plus, Sparkles,
  Target, Trash2, TrendingUp, X
} from "lucide-react";

const STORAGE_KEY = "mm-care-companion-v1";
const starter = {
  name: "My care routine",
  focus: "Hair care",
  products: [
    { id: "p1", name: "My hair care product", category: "Hair care", frequency: "Daily", time: "Morning", reminder: true, reorderDate: "" },
    { id: "p2", name: "My supporting product", category: "Hair care", frequency: "Daily", time: "Evening", reminder: false, reorderDate: "" }
  ],
  completions: {},
  checkins: []
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...starter, ...JSON.parse(raw) } : starter;
  } catch {
    return starter;
  }
}
const todayKey = () => new Date().toLocaleDateString("en-CA");
const prettyDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("overview");
  const [showAdd, setShowAdd] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [toast, setToast] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", category: "Hair care", frequency: "Daily", time: "Morning", reminder: true, reorderDate: "" });
  const [checkin, setCheckin] = useState({ mood: "On track", note: "" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const today = todayKey();
  const todaysProducts = useMemo(() => data.products.filter(p => p.frequency === "Daily" || p.frequency === "Weekdays"), [data.products]);
  const doneCount = todaysProducts.filter(p => data.completions[`${today}_${p.id}`]).length;
  const progress = todaysProducts.length ? Math.round(doneCount / todaysProducts.length * 100) : 0;
  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    while (count < 365) {
      const key = cursor.toLocaleDateString("en-CA");
      const daily = data.products.filter(p => p.frequency === "Daily" || p.frequency === "Weekdays");
      if (!daily.length || !daily.every(p => data.completions[`${key}_${p.id}`])) break;
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [data]);

  const dueSoon = data.products.filter(p => p.reorderDate && p.reorderDate >= today && Math.ceil((new Date(`${p.reorderDate}T12:00:00`) - new Date(`${today}T12:00:00`)) / 86400000) <= 7);
  const toggleDone = (id) => {
    const key = `${today}_${id}`;
    setData(prev => ({ ...prev, completions: { ...prev.completions, [key]: !prev.completions[key] } }));
  };
  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    setData(prev => ({ ...prev, products: [...prev.products, { ...newProduct, id: crypto.randomUUID() }] }));
    setNewProduct({ name: "", category: data.focus, frequency: "Daily", time: "Morning", reminder: true, reorderDate: "" });
    setShowAdd(false);
    setToast("Product added to your routine");
  };
  const deleteProduct = (id) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    setToast("Product removed");
  };
  const saveCheckin = (e) => {
    e.preventDefault();
    setData(prev => ({ ...prev, checkins: [{ id: crypto.randomUUID(), date: today, mood: checkin.mood, note: checkin.note.trim() }, ...prev.checkins] }));
    setCheckin({ mood: "On track", note: "" });
    setShowCheckin(false);
    setTab("progress");
    setToast("Your check-in was saved");
  };
  const resetDemo = () => {
    if (confirm("Reset your routine and all saved progress on this device?")) {
      localStorage.removeItem(STORAGE_KEY);
      setData(starter);
      setToast("Demo data reset");
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>mm</span></div>
          <div><strong>MAN MATTERS</strong><small>CARE COMPANION</small></div>
        </div>
        <div className="side-label">WORKSPACE</div>
        <nav>
          <button className={tab === "overview" ? "nav-item active" : "nav-item"} onClick={() => setTab("overview")}><Activity size={18}/> Overview</button>
          <button className={tab === "routine" ? "nav-item active" : "nav-item"} onClick={() => setTab("routine")}><ClipboardList size={18}/> My routine</button>
          <button className={tab === "progress" ? "nav-item active" : "nav-item"} onClick={() => setTab("progress")}><TrendingUp size={18}/> Progress journal</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Sparkles size={17}/></div>
            <strong>Small steps add up.</strong>
            <p>Build a routine that fits your day. Track consistency, not perfection.</p>
          </div>
          <button className="reset-btn" onClick={resetDemo}>Reset demo data</button>
          <div className="privacy-note"><span className="privacy-dot"/> Your information stays on this device.</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark"><span>mm</span></div><strong>MAN MATTERS</strong></div>
          <div className="breadcrumb">Your space <span>/</span> <b>{tab === "overview" ? "Overview" : tab === "routine" ? "My routine" : "Progress journal"}</b></div>
          <div className="top-right"><span className="today-label"><CalendarDays size={15}/>{prettyDate(today)}</span><div className="avatar">U</div></div>
        </header>

        <div className="content">
          {tab === "overview" && <>
            <section className="welcome-row">
              <div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PERSONAL CARE, MADE SIMPLE</div><h1>Make time for <em>you.</em></h1><p className="subhead">A little consistency goes a long way. Here's your care snapshot for today.</p></div>
              <button className="primary-btn" onClick={() => setShowAdd(true)}><Plus size={17}/> Add a product</button>
            </section>
            <section className="hero-card">
              <div className="hero-copy"><div className="hero-kicker"><Sparkles size={14}/> TODAY'S CHECK-IN</div><h2>Your routine.<br/><em>Your pace.</em></h2><p>Keep your products and habits in one place. Tick off each step as you go.</p><button className="hero-btn" onClick={() => setTab("routine")}>View my routine <ArrowRight size={16}/></button></div>
              <div className="progress-orbit">
                <div className="orbit-ring"><div className="orbit-inner"><strong>{progress}%</strong><span>COMPLETED</span></div></div>
                <div className="orbit-caption">{doneCount} of {todaysProducts.length} daily steps done</div>
              </div>
              <div className="hero-decoration decor-one"/><div className="hero-decoration decor-two"/>
            </section>
            <section className="stats-grid">
              <div className="stat-card"><div className="stat-icon green"><CheckCircle2 size={18}/></div><div className="stat-label">TODAY'S PROGRESS</div><strong>{doneCount}<small> / {todaysProducts.length}</small></strong><p>Steps completed</p></div>
              <div className="stat-card"><div className="stat-icon orange"><Flame size={18}/></div><div className="stat-label">CONSISTENCY STREAK</div><strong>{streak}<small> days</small></strong><p>Complete every daily step to build a streak</p></div>
              <div className="stat-card"><div className="stat-icon blue"><Bell size={18}/></div><div className="stat-label">REORDER WATCH</div><strong>{dueSoon.length}<small> products</small></strong><p>{dueSoon.length ? "Reorder dates coming up" : "No upcoming reorder dates"}</p></div>
            </section>
            <section className="section-heading"><div><div className="eyebrow">STAY ON TRACK</div><h2>Today's routine</h2></div><button className="text-btn" onClick={() => setTab("routine")}>See full routine <ArrowRight size={15}/></button></section>
            <div className="routine-preview">
              {todaysProducts.length ? todaysProducts.slice(0,4).map(p => <RoutineRow key={p.id} product={p} done={!!data.completions[`${today}_${p.id}`]} onToggle={() => toggleDone(p.id)}/>) : <EmptyState onAdd={() => setShowAdd(true)}/>}
            </div>
            <section className="bottom-grid">
              <div className="insight-card"><div className="insight-icon"><Target size={19}/></div><div><strong>Focus on consistency</strong><p>Use your journal to note how your routine is going. Your notes can help you reflect on changes over time.</p><button className="text-btn" onClick={() => setShowCheckin(true)}>Add a check-in <ArrowRight size={14}/></button></div></div>
              <div className="reorder-card"><div className="section-heading compact"><div><div className="eyebrow">PLAN AHEAD</div><h3>Reorder reminders</h3></div><Bell size={18}/></div>{dueSoon.length ? dueSoon.slice(0,2).map(p => <div className="reorder-line" key={p.id}><span>{p.name}</span><small>{prettyDate(p.reorderDate)}</small></div>) : <p className="muted-copy">Add an estimated reorder date to a product and we'll keep it visible here.</p>}</div>
            </section>
          </>}

          {tab === "routine" && <>
            <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PRODUCTS</div><h1>My <em>routine.</em></h1><p className="subhead">Keep your care steps organised in one simple list.</p></div><button className="primary-btn" onClick={() => setShowAdd(true)}><Plus size={17}/> Add a product</button></section>
            <div className="routine-summary"><div><span className="summary-label">TODAY</span><strong>{doneCount} / {todaysProducts.length} steps complete</strong></div><div className="mini-progress"><span style={{width:`${progress}%`}}/></div><span className="summary-percent">{progress}%</span></div>
            <div className="routine-list">
              {data.products.length ? data.products.map(p => <RoutineRow key={p.id} product={p} done={!!data.completions[`${today}_${p.id}`]} onToggle={() => toggleDone(p.id)} onDelete={() => deleteProduct(p.id)} expanded/>) : <EmptyState onAdd={() => setShowAdd(true)}/>}
            </div>
            <div className="tip-box"><Leaf size={18}/><div><strong>A routine should work for you.</strong><p>Follow the instructions provided with your product. If you are unsure how to use a product or experience a reaction, consult a qualified professional.</p></div></div>
          </>}

          {tab === "progress" && <>
            <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR JOURNAL</div><h1>Notice your <em>progress.</em></h1><p className="subhead">Capture how you're feeling and reflect on your consistency over time.</p></div><button className="primary-btn" onClick={() => setShowCheckin(true)}><Plus size={17}/> New check-in</button></section>
            <div className="journal-highlight"><div className="journal-highlight-icon"><TrendingUp size={22}/></div><div><strong>Your journey is personal.</strong><p>Progress can look different for everyone. Use these check-ins as personal notes, not as a measure of medical results.</p></div></div>
            <div className="journal-list">
              {data.checkins.length ? data.checkins.map(item => <div className="journal-entry" key={item.id}><div className="journal-date"><span>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN",{day:"2-digit"})}</span><small>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN",{month:"short"})}</small></div><div className="journal-entry-body"><div><strong>{item.mood}</strong><small>{prettyDate(item.date)}</small></div>{item.note && <p>{item.note}</p>}</div></div>) : <div className="empty-journal"><div className="empty-icon"><CalendarDays size={24}/></div><h3>Your journal starts here</h3><p>Add a check-in to record how your routine is going. Your entries stay on this device.</p><button className="primary-btn" onClick={() => setShowCheckin(true)}><Plus size={16}/> Add first check-in</button></div>}
            </div>
          </>}
          <footer className="footer"><span>MAN MATTERS CARE COMPANION</span><span>Built for better everyday routines · Independent concept prototype</span></footer>
        </div>
      </main>

      {showAdd && <Modal title="Add to your routine" subtitle="Add a product you already use. Follow its own label and professional guidance." onClose={() => setShowAdd(false)}>
        <form onSubmit={addProduct} className="modal-form">
          <label>Product name<input autoFocus value={newProduct.name} onChange={e => setNewProduct({...newProduct,name:e.target.value})} placeholder="e.g. Daily face wash" required/></label>
          <div className="form-row"><label>Category<select value={newProduct.category} onChange={e => setNewProduct({...newProduct,category:e.target.value})}>{["Hair care","Beard care","Skincare","Body care","Nutrition","Other"].map(x=><option key={x}>{x}</option>)}</select></label><label>Frequency<select value={newProduct.frequency} onChange={e => setNewProduct({...newProduct,frequency:e.target.value})}>{["Daily","Weekdays","Weekly","As needed"].map(x=><option key={x}>{x}</option>)}</select></label></div>
          <div className="form-row"><label>Usual time<select value={newProduct.time} onChange={e => setNewProduct({...newProduct,time:e.target.value})}>{["Morning","Afternoon","Evening","Anytime"].map(x=><option key={x}>{x}</option>)}</select></label><label>Estimated reorder date<input type="date" min={today} value={newProduct.reorderDate} onChange={e => setNewProduct({...newProduct,reorderDate:e.target.value})}/></label></div>
          <label className="check-label"><input type="checkbox" checked={newProduct.reminder} onChange={e => setNewProduct({...newProduct,reminder:e.target.checked})}/> Mark as a reminder in my routine</label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Add product</button></div>
        </form>
      </Modal>}

      {showCheckin && <Modal title="How is it going?" subtitle="A quick personal check-in. Be honest—there's no perfect answer." onClose={() => setShowCheckin(false)}>
        <form onSubmit={saveCheckin} className="modal-form">
          <label>How would you describe your routine today?<select value={checkin.mood} onChange={e => setCheckin({...checkin,mood:e.target.value})}>{["On track","Feeling good","Still building consistency","Taking a break","Need some guidance"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Notes <span className="optional">(optional)</span><textarea value={checkin.note} onChange={e => setCheckin({...checkin,note:e.target.value})} placeholder="Anything you noticed, questions to revisit, or how the routine felt..." rows="4" maxLength="500"/></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowCheckin(false)}>Cancel</button><button className="primary-btn" type="submit"><Check size={16}/> Save check-in</button></div>
        </form>
      </Modal>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function RoutineRow({ product, done, onToggle, onDelete, expanded=false }) {
  const icon = product.category === "Skincare" ? <Droplets size={18}/> : product.category === "Beard care" ? <Sparkles size={18}/> : <Leaf size={18}/>;
  return <div className={`routine-row ${done ? "is-done" : ""}`}>
    <button className="task-check" onClick={onToggle} aria-label={done ? "Mark incomplete" : "Mark complete"}>{done ? <CheckCircle2 size={23}/> : <Circle size={23}/>}</button>
    <div className="product-icon">{icon}</div>
    <div className="product-info"><strong>{product.name}</strong><span>{product.category} <i/> {product.time} · {product.frequency}</span>{expanded && product.reorderDate && <small className="reorder-date"><Bell size={12}/> Reorder around {prettyDate(product.reorderDate)}</small>}</div>
    <div className="task-status">{done ? "Completed" : "To do"}</div>
    {expanded && <button className="icon-btn delete-btn" onClick={onDelete} title="Remove product"><Trash2 size={16}/></button>}
  </div>;
}
function EmptyState({onAdd}) { return <div className="empty-state"><div className="empty-icon"><ClipboardList size={23}/></div><strong>Your routine is waiting</strong><p>Add the products you use to create your personal checklist.</p><button className="text-btn" onClick={onAdd}>Add your first product <ArrowRight size={15}/></button></div>; }
function Modal({title,subtitle,onClose,children}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal"><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>{children}</div></div>; }

export default App;