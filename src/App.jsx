import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, MapPin, Phone, Clock, Printer, Download, UtensilsCrossed, Salad, SendHorizonal, CheckCircle2, Settings, QrCode, Bike, Home, Store, Search, X } from "lucide-react";

// --- Utility helpers ---
const KR = new Intl.NumberFormat("ko-KR");
const price = (n) => `${KR.format(n)}원`;
const todayKey = () => new Date().toISOString().slice(0,10);
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

// --- Data: 메뉴 ---
const BASE_MENU = [
  { id: "sal-01", name: "살코기국밥", desc: "담백한 우사골 육수에 살코기 듬뿍", price: 9900, spicy: false, tags: ["베스트","사골"] },
  { id: "mod-02", name: "모듬국밥", desc: "살코기+수육이 조화로운 인기 메뉴", price: 10900, spicy: false, tags: ["베스트","든든"] },
  { id: "dae-03", name: "얼큰다데기국밥", desc: "칼칼하게 즐기는 매운 국밥", price: 10900, spicy: true, tags: ["매운맛"] },
  { id: "gal-04", name: "갈비탕(우사골)", desc: "우사골만 사용한 깊은 국물", price: 12900, spicy: false, tags: ["사골","시그니처"] },
  { id: "gop-05", name: "곱창전골(1인)", desc: "곱창 듬뿍, 얼큰 국물", price: 13900, spicy: true, tags: ["전골","인기"] },
  { id: "mae-06", name: "매생이떡국", desc: "속 편한 바다 향 매생이", price: 10900, spicy: false, tags: ["계절","담백"] },
  { id: "kim-07", name: "김치비지찌개", desc: "깊고 담백한 비지찌개", price: 9900, spicy: true, tags: ["집밥"] },
];

// 옵션/추가 메뉴
const EXTRAS = [
  { id: "rice", name: "공기밥 추가", price: 1000 },
  { id: "noodle", name: "사리 추가", price: 1500 },
  { id: "meat", name: "고기 추가", price: 3000 },
  { id: "size", name: "곱빼기", price: 2000 },
];

const STORE_INFO = {
  name: "미미국밥 인천점",
  phone: "032-000-0000",
  address: "인천 미추홀구 인하로 208 (주안 파크자이 앞)",
  hours: "매일 10:30 - 21:00 (라스트오더 20:30)",
  notice: "알레르기 유발 성분은 직원에게 문의해주세요. 포장 시 국물은 밀봉 용기에 안전히 담아드립니다.",
};

// --- 작은 UI ---
function Badge({ children }) {
  return <span className="text-xs py-0.5 px-2 rounded-full bg-gray-100 border mr-1">{children}</span>;
}
function Pill({ icon: Icon, label }) {
  return <span className="inline-flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-gray-100 border"><Icon size={14}/>{label}</span>;
}

// --- Header ---
function Header({ onOpenCart, cartCount, onOpenAdmin }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed />
          <h1 className="text-lg font-semibold">{STORE_INFO.name}</h1>
          <span className="hidden sm:inline text-sm text-gray-500">— 담백한 사골육수, 고기 푸짐</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenAdmin} className="hidden sm:inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1 hover:bg-gray-50"><Settings size={16}/> 관리자</button>
          <button onClick={onOpenCart} className="relative inline-flex items-center gap-2 border rounded-full px-3 py-1 hover:bg-gray-50"><ShoppingCart/><span className="text-sm">{cartCount}</span></button>
        </div>
      </div>
    </header>
  );
}

// --- MenuItem ---
function MenuItem({ item, onAdd }) {
  const [qty, setQty] = useState(1);
  const [extraIds, setExtraIds] = useState([]);
  const [spice, setSpice] = useState(item.spicy ? "보통" : "순한맛");
  const toggleExtra = (id) => setExtraIds((p)=> p.includes(id)? p.filter(x=>x!==id):[...p,id]);
  const itemTotal = useMemo(()=>{
    const extrasPrice = EXTRAS.filter(e=> extraIds.includes(e.id)).reduce((a,b)=>a+b.price,0);
    return (item.price + extrasPrice) * qty;
  },[item.price, extraIds, qty]);

  return (
    <motion.div layout className="p-4 border rounded-2xl bg-white shadow-sm" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.desc}</p>
          <div className="mt-2 flex items-center gap-1">
            {item.spicy && <Pill icon={Salad} label="매운맛"/>}
            {item.tags?.map((t)=> <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
        <div className="text-right min-w-[90px]"><div className="font-semibold">{price(item.price)}</div></div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 shrink-0">수량</span>
          <div className="flex items-center border rounded-full">
            <button className="p-1" onClick={()=> setQty(Math.max(1, qty-1))}><Minus size={18}/></button>
            <span className="w-8 text-center">{qty}</span>
            <button className="p-1" onClick={()=> setQty(qty+1)}><Plus size={18}/></button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 shrink-0">맵기</span>
          <select className="border rounded-full px-3 py-1 w-full" value={spice} onChange={(e)=> setSpice(e.target.value)}>
            {item.spicy ? ["순한맛","보통","매운맛"].map(v=> <option key={v}>{v}</option>) : ["순한맛","보통"].map(v=> <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <div className="text-gray-600">추가</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {EXTRAS.map(ex=> (
              <label key={ex.id} className={`text-xs inline-flex items-center gap-1 border rounded-full px-2 py-1 cursor-pointer ${extraIds.includes(ex.id)?"bg-gray-100":""}`}>
                <input type="checkbox" className="hidden" checked={extraIds.includes(ex.id)} onChange={()=> toggleExtra(ex.id)} />
                <span>{ex.name}</span>
                <span className="text-gray-500">+{KR.format(ex.price)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">소계: <span className="font-semibold text-gray-900">{price(itemTotal)}</span></div>
        <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 border shadow-sm hover:bg-gray-50" onClick={()=> onAdd({ ...item, qty, extras: EXTRAS.filter(e=> extraIds.includes(e.id)), spice })}><Plus size={18}/> 담기</button>
      </div>
    </motion.div>
  );
}

// --- Cart Drawer ---
function CartDrawer({ open, onClose, cart, setCart, onCheckout }) {
  const total = useMemo(()=> cart.reduce((a,it)=> a + (it.price + (it.extras?.reduce((x,y)=>x+y.price,0)||0)) * it.qty, 0), [cart]);
  const updateQty = (id, d) => setCart((p)=> p.map(it=> it._id===id? {...it, qty: Math.max(1, it.qty + d)}: it));
  const removeItem = (id) => setCart((p)=> p.filter(it=> it._id!==id));

  return (
    <AnimatePresence>
      {open && (
        <motion.aside className="fixed inset-0 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
          <motion.div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl flex flex-col" initial={{x:480}} animate={{x:0}} exit={{x:480}}>
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">장바구니</h2>
              <button className="p-2 hover:bg-gray-50 rounded-full" onClick={onClose}><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length===0 && <div className="text-sm text-gray-500">담긴 메뉴가 없습니다.</div>}
              {cart.map((it)=> (
                <div key={it._id} className="border rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-600">맵기: {it.spice}</div>
                      {it.extras?.length>0 && <div className="mt-1 text-xs text-gray-600">추가: {it.extras.map(e=>e.name).join(", ")}</div>}
                    </div>
                    <div className="text-right"><div className="font-semibold">{price((it.price + (it.extras?.reduce((x,y)=>x+y.price,0)||0)) * it.qty)}</div></div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center border rounded-full">
                      <button className="p-1" onClick={()=> updateQty(it._id,-1)}><Minus size={16}/></button>
                      <span className="w-8 text-center text-sm">{it.qty}</span>
                      <button className="p-1" onClick={()=> updateQty(it._id,+1)}><Plus size={16}/></button>
                    </div>
                    <button className="text-sm inline-flex items-center gap-1 text-red-600" onClick={()=> removeItem(it._id)}><Trash2 size={16}/>삭제</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">총 결제 예상</span><span className="text-lg font-semibold">{price(total)}</span></div>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-black text-white" onClick={onCheckout} disabled={cart.length===0}><SendHorizonal/> 주문서 작성</button>
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// --- Checkout ---
function Checkout({ cart, onBack, onComplete }) {
  const total = useMemo(()=> cart.reduce((a,it)=> a + (it.price + (it.extras?.reduce((x,y)=>x+y.price,0)||0)) * it.qty, 0), [cart]);
  const [type, setType] = useState("매장");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [pickupAt, setPickupAt] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    const order = { id: uid(), date: new Date().toISOString(), day: todayKey(), type, name, phone, tableNo, pickupAt, memo, items: cart, total, status: "접수대기" };
    const list = JSON.parse(localStorage.getItem("mimi_orders")||"[]");
    list.push(order);
    localStorage.setItem("mimi_orders", JSON.stringify(list));
    onComplete(order);
    setTimeout(()=> window.print(), 300); // 간단 영수증 출력
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button className="text-sm text-gray-600 mb-3" onClick={onBack}>← 뒤로</button>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="border rounded-2xl p-4">
            <div className="font-semibold mb-2">주문 정보</div>
            <div className="space-y-2 text-sm">
              <label className="block">주문 유형
                <select className="mt-1 w-full border rounded-xl px-3 py-2" value={type} onChange={(e)=> setType(e.target.value)}>
                  <option>매장</option><option>포장</option><option disabled>배달(준비중)</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">이름
                  <input className="mt-1 w-full border rounded-xl px-3 py-2" value={name} onChange={(e)=> setName(e.target.value)} placeholder="성함"/>
                </label>
                <label className="block">연락처
                  <input className="mt-1 w-full border rounded-xl px-3 py-2" value={phone} onChange={(e)=> setPhone(e.target.value)} placeholder="010-0000-0000"/>
                </label>
              </div>
              {type==="매장" && <label className="block">테이블 번호(선택)
                <input className="mt-1 w-full border rounded-xl px-3 py-2" value={tableNo} onChange={(e)=> setTableNo(e.target.value)} placeholder="예: A5"/>
              </label>}
              {type==="포장" && <label className="block">픽업 예정 시간(선택)
                <input className="mt-1 w-full border rounded-xl px-3 py-2" value={pickupAt} onChange={(e)=> setPickupAt(e.target.value)} placeholder="예: 12:20"/>
              </label>}
              <label className="block">요청사항
                <textarea className="mt-1 w-full border rounded-xl px-3 py-2" rows={3} value={memo} onChange={(e)=> setMemo(e.target.value)} placeholder="덜 맵게, 국물 넉넉히 등"/>
              </label>
            </div>
          </div>
          <div className="border rounded-2xl p-4 text-sm">
            <div className="font-semibold mb-2">결제</div>
            <p className="text-gray-600">현장결제(현금/카드/QR) — 온라인 결제는 결제대행(PG) 연동 시 활성화됩니다.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="border rounded-2xl p-4">
            <div className="font-semibold mb-2">주문 내역</div>
            <div className="space-y-2 text-sm">
              {cart.map((it)=> (
                <div key={it._id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{it.name} × {it.qty}</div>
                    <div className="text-xs text-gray-600">맵기: {it.spice}</div>
                    {it.extras?.length>0 && <div className="text-xs text-gray-600">추가: {it.extras.map(e=>e.name).join(', ')}</div>}
                  </div>
                  <div className="font-semibold">{price((it.price + (it.extras?.reduce((x,y)=>x+y.price,0)||0)) * it.qty)}</div>
                </div>
              ))}
              <div className="border-t pt-2 flex items-center justify-between"><span>총합</span><span className="text-lg font-semibold">{price(total)}</span></div>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-black text-white"><Printer/> 주문 접수 & 영수증 출력</button>
        </div>
      </div>
    </div>
  );
}

// --- Admin Panel ---
function AdminPanel({ open, onClose }) {
  const [q, setQ] = useState("");
  const [day, setDay] = useState(todayKey());
  const list = JSON.parse(localStorage.getItem("mimi_orders")||"[]");
  const orders = useMemo(()=> list
    .filter(o=> o.day===day)
    .filter(o=> (o.name?.includes(q) || o.phone?.includes(q) || o.items?.some(i=> i.name.includes(q))))
    .sort((a,b)=> new Date(b.date)-new Date(a.date))
  ,[q,day,list]);

  const downloadCSV = () => {
    const rows = [
      ["주문ID","날짜","유형","이름","연락처","테이블","픽업","메모","메뉴","총합"],
      ...orders.map(o=> [
        o.id,o.date,o.type,o.name,o.phone,o.tableNo||"",o.pickupAt||"",o.memo?.replace(/\n/g,' '),
        o.items.map(i=> `${i.name}x${i.qty}${i.extras?.length?`(+${i.extras.map(e=>e.name).join('+')})`:''}`).join(' / '),
        o.total,
      ])
    ];
    const csv = rows.map(r=> r.map(v=>`"${(v??"").toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `mimi-orders-${day}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
          <motion.div className="absolute right-0 top-0 h-full w-full sm:w-[720px] bg-white shadow-xl flex flex-col" initial={{x:800}} animate={{x:0}} exit={{x:800}}>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">관리자(로컬)</div>
              <button className="p-2 hover:bg-gray-50 rounded-full" onClick={onClose}><X/></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid sm:grid-cols-3 gap-2">
                <input className="border rounded-xl px-3 py-2" placeholder="검색: 이름/전화/메뉴" value={q} onChange={(e)=> setQ(e.target.value)} />
                <input type="date" className="border rounded-xl px-3 py-2" value={day} onChange={(e)=> setDay(e.target.value)} />
                <button className="inline-flex items-center justify-center gap-2 border rounded-xl px-3 py-2" onClick={downloadCSV}><Download/> CSV 내보내기</button>
              </div>
              <div className="grid gap-3 max-h-[70vh] overflow-y-auto">
                {orders.map(o=> (
                  <div key={o.id} className="border rounded-2xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">#{o.id.slice(-6)} <span className="text-xs text-gray-500">{new Date(o.date).toLocaleString()}</span></div>
                      <div className="text-sm">{price(o.total)}</div>
                    </div>
                    <div className="text-sm mt-1 flex flex-wrap gap-2">
                      <Pill icon={o.type==="포장"?Home:o.type==="매장"?Store:Bike} label={o.type}/>
                      {o.tableNo && <Badge>테이블 {o.tableNo}</Badge>}
                      {o.pickupAt && <Badge>픽업 {o.pickupAt}</Badge>}
                    </div>
                    <div className="text-sm mt-2">{o.items.map(i=> `${i.name}×${i.qty}${i.extras?.length?`(+${i.extras.map(e=>e.name).join('+')})`:''}`).join(' / ')}</div>
                    {o.memo && <div className="text-xs text-gray-600 mt-1">요청: {o.memo}</div>}
                    <div className="text-xs text-gray-500 mt-1">{o.name} · {o.phone}</div>
                  </div>
                ))}
                {orders.length===0 && <div className="text-sm text-gray-500">해당 날짜의 주문이 없습니다.</div>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Info / Hero / QR ---
function InfoCard() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-4">
          <div className="font-semibold mb-2">영업정보</div>
          <div className="text-sm flex items-center gap-2"><Clock size={16}/> {STORE_INFO.hours}</div>
          <div className="text-sm flex items-center gap-2 mt-1"><Phone size={16}/> {STORE_INFO.phone}</div>
          <div className="text-sm flex items-center gap-2 mt-1"><MapPin size={16}/> {STORE_INFO.address}</div>
        </div>
        <div className="border rounded-2xl p-4 md:col-span-2">
          <div className="font-semibold mb-2">공지</div>
          <p className="text-sm text-gray-700">{STORE_INFO.notice}</p>
        </div>
      </div>
    </section>
  );
}
function Hero({ onScrollToMenu }) {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 border-b">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">나만의 국밥을 커스터마이징, <span className="whitespace-nowrap">내 맘대로 주문하는</span> 미미국밥 💯</h2>
          <p className="mt-3 text-gray-600">QR 주문·포장 예약 가능. 사골육수와 고기 푸짐함으로 든든한 한 끼를 전해드립니다.</p>
          <div className="mt-4 flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl px-4 py-3 bg-black text-white" onClick={onScrollToMenu}><ShoppingCart/> 지금 주문하기</button>
            <a className="inline-flex items-center gap-2 rounded-xl px-4 py-3 border" href="#qr"><QrCode/> 테이블 QR</a>
          </div>
        </div>
        <div className="flex-1 w-full"><div className="aspect-[4/3] w-full rounded-2xl border bg-white grid place-items-center text-gray-400">가게 사진 영역</div></div>
      </div>
    </section>
  );
}
function QRHowTo() {
  return (
    <section id="qr" className="max-w-5xl mx-auto px-4 py-8">
      <div className="border rounded-2xl p-4">
        <div className="font-semibold mb-2">테이블 QR 주문</div>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
          <li>이 페이지 주소를 복사하여 테이블별 QR 스티커로 출력합니다. (예: <code>?table=A5</code> 형식)</li>
          <li>손님이 QR을 스캔하여 페이지에 접속 → 메뉴 담기 → 주문서 작성 → 현장결제.</li>
          <li>주문은 이 브라우저(키오스크/카운터 PC)의 관리자 화면에 저장됩니다. (로컬 MVP)</li>
        </ol>
      </div>
    </section>
  );
}

export default function MimiGukbapOrderApp() {
  const [menu] = useState(BASE_MENU);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [stage, setStage] = useState("menu"); // menu | checkout | done
  const [orderDone, setOrderDone] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    const url = new URL(window.location.href);
    const table = url.searchParams.get('table');
    if (table) localStorage.setItem('mimi_table_hint', table);
  },[]);

  const addToCart = (item) => { const _id = uid(); setCart((p)=> [...p, { ...item, _id }]); setShowCart(true); };
  const handleCheckout = () => setStage("checkout");
  const handleComplete = (order) => { setOrderDone(order); setCart([]); setStage("done"); };
  const filteredMenu = useMemo(()=> menu.filter(m=> m.name.includes(search) || m.desc.includes(search)), [menu, search]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header onOpenCart={()=> setShowCart(true)} cartCount={cart.length} onOpenAdmin={()=> setAdminOpen(true)} />
      <Hero onScrollToMenu={()=> document.getElementById('menu')?.scrollIntoView({behavior:'smooth'})} />
      <InfoCard/>
      <section id="menu" className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">메뉴</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5" size={16}/>
              <input className="border rounded-xl pl-8 pr-3 py-2 text-sm" placeholder="메뉴 검색" value={search} onChange={(e)=> setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredMenu.map(item=> <MenuItem key={item.id} item={item} onAdd={addToCart} />)}
        </div>
      </section>
      <QRHowTo/>

      {stage==="checkout" && <Checkout cart={cart} onBack={()=> setStage("menu")} onComplete={handleComplete} />}

      {stage==="done" && orderDone && (
        <section className="max-w-3xl mx-auto p-6">
          <div className="border rounded-2xl p-6 text-center">
            <CheckCircle2 className="mx-auto" size={36}/>
            <h3 className="text-xl font-semibold mt-2">주문이 접수되었습니다!</h3>
            <p className="text-gray-600 mt-1 text-sm">주문번호 #{orderDone.id.slice(-6)} — 카운터에서 결제해 주세요.</p>
            <div className="mt-4">
              <button className="inline-flex items-center gap-2 border rounded-xl px-4 py-2" onClick={()=> window.print()}><Printer/> 영수증 다시 출력</button>
            </div>
          </div>
        </section>
      )}

      <CartDrawer open={showCart} onClose={()=> setShowCart(false)} cart={cart} setCart={setCart} onCheckout={handleCheckout} />
      <AdminPanel open={adminOpen} onClose={()=> setAdminOpen(false)} />

      <footer className="border-t mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-gray-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:underline">이용약관</a>
            <a href="#" className="hover:underline">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
