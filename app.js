// ============================================================
//  HydRooms — app.js  (shared logic, localStorage as DB)
// ============================================================

const $ = id => document.getElementById(id);
function showMsg(id, type, text) {
  const el = $(id); if (!el) return;
  el.className = `msg ${type}`; el.textContent = text; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
function getUsers()   { return JSON.parse(localStorage.getItem('hr_users') || '[]'); }
function getRooms()   { return JSON.parse(localStorage.getItem('hr_rooms') || '[]'); }
function saveUsers(u) { localStorage.setItem('hr_users', JSON.stringify(u)); }
function saveRooms(r) { localStorage.setItem('hr_rooms', JSON.stringify(r)); }
function getSession() { return JSON.parse(localStorage.getItem('hr_session') || 'null'); }
function setSession(u){ localStorage.setItem('hr_session', JSON.stringify(u)); }
function logout() { localStorage.removeItem('hr_session'); window.location.href = 'index.html'; }
function initNavbar() {
  const sess = getSession();
  const li = $('navLogout');
  if (sess && li) li.style.display = 'list-item';
}
document.addEventListener('DOMContentLoaded', initNavbar);

/* ============================================================
   ALL HYDERABAD AREAS — 100 + localities (alphabetical)
============================================================ */
const HYD_AREAS = [
  "Abids","Alwal","Amberpet","Ameerpet","AS Rao Nagar","Attapur",
  "Bachupally","Bahadurpura","Balanagar","Bandlaguda","Bansilalpet","Banjara Hills",
  "Barkatpura","Begumpet","Bhel Colony","Boduppal","Borabanda",
  "Chandanagar","Charminar","Chikkadpally","Chintal",
  "Dilsukhnagar","Domalguda","Dundigal",
  "ECIL","Erragadda",
  "Falaknuma","Film Nagar",
  "Gachibowli","Ghatkesar","Golconda","Goshamahal","Gudimalkapur",
  "Hafizpet","Hayathnagar","Himayathnagar","Hitech City",
  "Jagadgirigutta","Jeedimetla","JNTU","Jubilee Hills",
  "Kapra","Karkhana","Karmanghat","Keesara","Khairatabad",
  "Kokapet","Kompally","Kondapur","Kothapet","Kothaguda","Kukatpally",
  "LB Nagar","Lingampally",
  "Madannapet","Madhapur","Madinaguda","Malakpet","Malkajgiri",
  "Manikonda","Marredpally","Mehdipatnam","Miyapur","Moosapet","Musheerabad",
  "Nacharam","Nagole","Nagaram","Nanakramguda","Narayanguda","Narsingi",
  "Neredmet","Nizampet",
  "Old City",
  "Parsigutta","Patancheru","Punjagutta",
  "Raidurg","Ramachandrapuram","Ramanthapur","RC Puram",
  "Sainikpuri","Saroornagar","Secunderabad","Serilingampally",
  "Shaikpet","Shamirpet","Shapur Nagar","SR Nagar","Suraram",
  "Tarnaka","Tolichowki","Trimulgherry","Turkayamjal",
  "Uppal",
  "Vanasthalipuram","Vidyanagar",
  "Warasiguda",
  "Yousufguda"
];

/* Auto-populate every <select class="area-select"> */
function populateAreaSelects() {
  document.querySelectorAll('.area-select').forEach(sel => {
    const first = sel.options[0];
    sel.innerHTML = '';
    sel.appendChild(first);
    HYD_AREAS.forEach(a => {
      const o = document.createElement('option');
      o.value = a; o.textContent = a;
      sel.appendChild(o);
    });
  });
}
document.addEventListener('DOMContentLoaded', populateAreaSelects);

/* Google Maps URL */
function mapsUrl(room) {
  const q = encodeURIComponent(
    `${room.address ? room.address + ', ' : ''}${room.area}, Hyderabad, Telangana, India`
  );
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/* ---- Seed demo data (16 rooms, all Hyd areas) ---- */
function seedDemo() {
  if (localStorage.getItem('hr_seeded3')) return;
  saveUsers([
    {id:'u1',name:'Ravi Kumar',  email:'ravi@demo.com',  password:'demo123',role:'owner', phone:'9876543210'},
    {id:'u2',name:'Priya Sharma',email:'priya@demo.com', password:'demo123',role:'renter',phone:'9988776655'},
    {id:'u3',name:'Suresh Reddy',email:'suresh@demo.com',password:'demo123',role:'owner', phone:'9123456780'},
  ]);
  saveRooms([
    {id:'r1', ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'Spacious Single Room',area:'Ameerpet',
     address:'Plot No. 12, Journalist Colony, Ameerpet',landmark:'Near Ameerpet Metro Station (200 m)',
     type:'Single Room',price:5500,furnishing:'Semi-Furnished',amenities:'WiFi, AC, Parking',
     description:'Quiet locality, near metro. Ideal for working professionals.',available:true,postedOn:'2026-11-20'},

    {id:'r2', ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'1 BHK Flat – Hitech City',area:'Hitech City',
     address:'Flat 4B, Cyber Heights Apt, Vittal Rao Nagar, Hitech City',landmark:'Opposite Inorbit Mall, 5 min to Metro',
     type:'1 BHK',price:14000,furnishing:'Fully Furnished',amenities:'WiFi, AC, Gym, Security',
     description:'Modern 1 BHK near IT hub. 24/7 security.',available:true,postedOn:'2026-11-18'},

    {id:'r3', ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'PG for Boys – Gachibowli',area:'Gachibowli',
     address:'H.No 8-2-293, ISB Road, Gachibowli',landmark:'Near Gachibowli Stadium, 2 min from Bus Stop',
     type:'PG / Hostel',price:7000,furnishing:'Furnished',amenities:'Meals, WiFi, Laundry',
     description:'PG with meals included. 2 mins walk from bus stop.',available:true,postedOn:'2026-11-15'},

    {id:'r4', ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'2 BHK – Madhapur',area:'Madhapur',
     address:'Flat 7A, Laxmi Towers, Durgam Cheruvu Road, Madhapur',landmark:'Near Durgam Cheruvu, 10 min to Financial District',
     type:'2 BHK',price:22000,furnishing:'Fully Furnished',amenities:'WiFi, AC, Parking, Gym',
     description:'Luxurious 2 BHK near financial district.',available:true,postedOn:'2026-11-10'},

    {id:'r5', ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'Double Room – Kukatpally',area:'Kukatpally',
     address:'Plot 45, KPHB Colony Phase 3, Kukatpally',landmark:'Near KPHB Metro Station (400 m), Opposite Big Bazar',
     type:'Double Room',price:8000,furnishing:'Semi-Furnished',amenities:'WiFi, Fan, Parking',
     description:'Affordable double room. Sharing available too.',available:true,postedOn:'2026-11-22'},

    {id:'r6', ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'1 BHK – Kondapur',area:'Kondapur',
     address:'Flat 2C, Sri Nilayam Apt, Kondapur Main Road',landmark:'Near Kondapur Bus Stop, 5 min to Hitech City',
     type:'1 BHK',price:12000,furnishing:'Semi-Furnished',amenities:'WiFi, AC',
     description:'Well-ventilated flat, close to schools and market.',available:true,postedOn:'2026-11-19'},

    {id:'r7', ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'Single Room – Banjara Hills',area:'Banjara Hills',
     address:'Road No. 12, Banjara Hills, Hyderabad',landmark:'Near GVK One Mall, 3 min to Care Hospital',
     type:'Single Room',price:9000,furnishing:'Furnished',amenities:'WiFi, AC, Security',
     description:'Premium locality, great connectivity.',available:true,postedOn:'2026-11-21'},

    {id:'r8', ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'PG for Girls – Secunderabad',area:'Secunderabad',
     address:'H.No 3-6-472, Mahendra Hills, Secunderabad',landmark:'Near Paradise Circle, 10 min to Railway Station',
     type:'PG / Hostel',price:6000,furnishing:'Furnished',amenities:'Meals, WiFi, CCTV',
     description:'Safe and secure PG for girls. Warden on premises.',available:true,postedOn:'2026-11-17'},

    {id:'r9', ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'2 BHK – Jubilee Hills',area:'Jubilee Hills',
     address:'Plot 1245, Road No. 36, Jubilee Hills',landmark:'Near Jubilee Hills Check Post, 5 min to Film Nagar',
     type:'2 BHK',price:25000,furnishing:'Fully Furnished',amenities:'WiFi, AC, Parking, Power Backup',
     description:'Upscale 2 BHK in prime Jubilee Hills. Quiet and clean.',available:true,postedOn:'2026-11-16'},

    {id:'r10',ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'Single Room – Dilsukhnagar',area:'Dilsukhnagar',
     address:'H.No 5-9-23, Yellareddyguda, Dilsukhnagar',landmark:'Near Dilsukhnagar Metro Station (300 m)',
     type:'Single Room',price:4500,furnishing:'Semi-Furnished',amenities:'WiFi, Fan',
     description:'Budget-friendly room, great public transport access.',available:true,postedOn:'2026-11-14'},

    {id:'r11',ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'1 BHK – Miyapur',area:'Miyapur',
     address:'Flat 3A, Green Valley Apt, Miyapur Main Road',landmark:'Near Miyapur Metro Station (500 m)',
     type:'1 BHK',price:10000,furnishing:'Semi-Furnished',amenities:'WiFi, AC, Parking',
     description:'Spacious 1 BHK, good for families and couples.',available:true,postedOn:'2026-11-13'},

    {id:'r12',ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'PG – Kompally',area:'Kompally',
     address:'H.No 10-2-45, Suchitra Circle, Kompally',landmark:'Near Suchitra Circle, 10 min to Alwal',
     type:'PG / Hostel',price:5500,furnishing:'Furnished',amenities:'Meals, WiFi, Laundry',
     description:'Affordable PG with home-cooked meals.',available:true,postedOn:'2026-11-12'},

    {id:'r13',ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'Double Room – Uppal',area:'Uppal',
     address:'H.No 7-1-62, Ramnagar Colony, Uppal',landmark:'Near Uppal Metro Station (600 m)',
     type:'Double Room',price:7500,furnishing:'Semi-Furnished',amenities:'WiFi, Fan, Water',
     description:'Good connectivity to old city and IT corridor.',available:true,postedOn:'2026-11-11'},

    {id:'r14',ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'1 BHK – Manikonda',area:'Manikonda',
     address:'Flat 5B, Vaishnavi Residency, Manikonda Village Road',landmark:'Near Lanco Hills, 10 min to Gachibowli',
     type:'1 BHK',price:11000,furnishing:'Semi-Furnished',amenities:'WiFi, AC, Parking',
     description:'Close to tech parks. Good for IT employees.',available:true,postedOn:'2026-11-09'},

    {id:'r15',ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'Single Room – LB Nagar',area:'LB Nagar',
     address:'H.No 2-3-45, Santosh Nagar, LB Nagar',landmark:'Near LB Nagar Metro Station (200 m)',
     type:'Single Room',price:4800,furnishing:'Unfurnished',amenities:'Water, Electricity',
     description:'Budget room near metro. Best for students.',available:true,postedOn:'2026-11-08'},

    {id:'r16',ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'2 BHK – Narsingi',area:'Narsingi',
     address:'Flat 9C, Aparna Towers, Narsingi Main Road',landmark:'Near Outer Ring Road, 15 min to Financial District',
     type:'2 BHK',price:18000,furnishing:'Fully Furnished',amenities:'WiFi, AC, Gym, Parking',
     description:'Gated community with all amenities. Very safe.',available:true,postedOn:'2026-11-07'},

    {id:'r17',ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'Single Room – ECIL',area:'ECIL',
     address:'H.No 2-98, ECIL X Road, Kapra',landmark:'Near ECIL Bus Depot, 5 min to Neredmet',
     type:'Single Room',price:4200,furnishing:'Semi-Furnished',amenities:'WiFi, Fan',
     description:'Affordable room in peaceful locality.',available:true,postedOn:'2026-11-06'},

    {id:'r18',ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'1 BHK – Bachupally',area:'Bachupally',
     address:'Flat 6A, Sai Towers, Bachupally Main Road',landmark:'Near Bachupally Bus Stop, 15 min to Miyapur',
     type:'1 BHK',price:9500,furnishing:'Semi-Furnished',amenities:'WiFi, AC',
     description:'New construction, fresh interiors, good ventilation.',available:true,postedOn:'2026-11-05'},

    {id:'r19',ownerId:'u1',ownerName:'Ravi Kumar',  ownerPhone:'9876543210',ownerEmail:'ravi@demo.com',
     title:'PG for Boys – Mehdipatnam',area:'Mehdipatnam',
     address:'H.No 16-11-21, Saleem Nagar, Mehdipatnam',landmark:'Near Mehdipatnam Bus Stand, 10 min to Tolichowki',
     type:'PG / Hostel',price:5800,furnishing:'Furnished',amenities:'Meals, WiFi, Water',
     description:'Veg and non-veg meals available. 24/7 water supply.',available:true,postedOn:'2026-11-04'},

    {id:'r20',ownerId:'u3',ownerName:'Suresh Reddy',ownerPhone:'9123456780',ownerEmail:'suresh@demo.com',
     title:'2 BHK – Kokapet',area:'Kokapet',
     address:'Flat 11B, Phoenix Towers, Kokapet Main Road',landmark:'Near Nanakramguda Financial District, ORR Exit 14',
     type:'2 BHK',price:21000,furnishing:'Fully Furnished',amenities:'WiFi, AC, Gym, Parking, Security',
     description:'Premium gated community near financial district.',available:true,postedOn:'2026-11-03'},
  ]);
  localStorage.setItem('hr_seeded3', '1');
}
seedDemo();

/* ---- Room card HTML builder ---- */
function buildRoomCard(room, mode='renter') {
  const icons = {'Single Room':'🛏️','Double Room':'🛏️🛏️','1 BHK':'🏠','2 BHK':'🏡','PG / Hostel':'🏘️'};
  const icon = icons[room.type] || '🏠';
  const mapLink = mapsUrl(room);

  const ownerActions = mode==='owner'
    ? `<button class="btn-delete" onclick="deleteRoom('${room.id}')">🗑 Delete</button>`
    : `<button class="btn-contact" onclick="showContact('${room.id}')"><i class="fa-solid fa-phone"></i> Contact Owner</button>`;

  const addrHtml = room.address
    ? `<div class="location-row"><i class="fa-solid fa-map-marker-alt loc-icon"></i><span>${room.address}</span></div>` : '';
  const lmHtml = room.landmark
    ? `<div class="location-row landmark-row"><i class="fa-solid fa-thumbtack loc-icon"></i><span>${room.landmark}</span></div>` : '';

  return `
    <div class="room-card" id="card-${room.id}">
      <div class="room-img">${icon}</div>
      <div class="room-body">
        <h3>${room.title}</h3>
        <div class="room-meta">
          <span class="tag"><i class="fa-solid fa-location-dot"></i> ${room.area}</span>
          <span class="tag orange">${room.type}</span>
          <span class="tag green">${room.furnishing}</span>
        </div>
        <div class="location-block">
          ${addrHtml}
          ${lmHtml}
          <a href="${mapLink}" target="_blank" class="map-btn">
            <i class="fa-solid fa-map"></i> View on Google Maps
          </a>
        </div>
        <p style="font-size:0.85rem;color:#64748b;margin:8px 0 6px;">${room.description}</p>
        <div style="font-size:0.8rem;color:#94a3b8;margin-bottom:8px;"><i class="fa-solid fa-wifi"></i> ${room.amenities}</div>
        <div class="price">₹${room.price.toLocaleString('en-IN')}<span>/month</span></div>
        <div class="room-actions">${ownerActions}</div>
      </div>
    </div>`;
}

/* ---- Contact modal ---- */
function showContact(roomId) {
  const room = getRooms().find(r => r.id === roomId);
  if (!room) return;
  document.getElementById('contactModalBody').innerHTML = `
    <div class="contact-info">
      <div class="contact-row"><i class="fa-solid fa-user"></i><div><strong>${room.ownerName}</strong><br><small>Owner</small></div></div>
      <div class="contact-row"><i class="fa-solid fa-phone"></i><div><a href="tel:${room.ownerPhone}">${room.ownerPhone}</a></div></div>
      <div class="contact-row"><i class="fa-solid fa-envelope"></i><div><a href="mailto:${room.ownerEmail}">${room.ownerEmail}</a></div></div>
      <div class="contact-row"><i class="fa-solid fa-map-marker-alt"></i><div>${room.address ? room.address+'<br>' : ''}${room.area}, Hyderabad</div></div>
      ${room.landmark ? `<div class="contact-row"><i class="fa-solid fa-thumbtack"></i><div>${room.landmark}</div></div>` : ''}
      <a href="${mapsUrl(room)}" target="_blank" class="map-btn" style="margin-top:6px;">
        <i class="fa-solid fa-map"></i> Open in Google Maps
      </a>
    </div>`;
  document.getElementById('contactModal').classList.add('show');
}
function closeContact() { document.getElementById('contactModal')?.classList.remove('show'); }
