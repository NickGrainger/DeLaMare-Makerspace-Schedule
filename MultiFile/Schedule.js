const startHour = 8.0;
const endHour = 19.0;
const increment = 0.5;
const machines = [
  "Maker Wrangler", "Maker Wrangler: 3D Modeling", "3D Scanner: Leo", "3D Scanner: Spider", "Laser Cutter: Dremel",
  "Laser Cutter: Epilog", "Vinyl Cutter: 48 inch", "Vinyl Cutter: 24 inch", "Vacuum Former", "Router: Shaper Origin",
  "Router: CNC", "Embroidery Machine", "PCB Milling Machine", "Audio Recording Booth"
];

// Full time slots from start to end
const fullTimeSlots = [];
for (let time = startHour; time < endHour; time += increment) {
  fullTimeSlots.push(time);
}

// Format time helper
function formatTime(h) {
  const hour = Math.floor(h);
  const minutes = h % 1 === 0 ? "00" : "30";
  const adjusted = hour > 12 ? hour - 12 : hour;
  return `${adjusted}:${minutes}`;
}


// Toggle state: true = show through 5pm, false = show through 7pm
let showThrough5pm = false;

// Current time slots shown
let timeSlots = [];

function updateTimeSlots() {
  const cutoff = showThrough5pm ? 17 : 19;
  timeSlots = fullTimeSlots.filter(t => t <= cutoff);
}

function buildGrid() {
  updateTimeSlots();
  const grid = document.getElementById('bookingGrid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `125px repeat(${timeSlots.length}, 1fr)`;

  const headerBlank = document.createElement('div');
  headerBlank.className = 'grid-header';
  grid.appendChild(headerBlank);

  timeSlots.forEach(time => {
    const header = document.createElement('div');
    header.className = 'grid-header';
    header.textContent = formatTime(time);
    grid.appendChild(header);
  });

  const states = ['available', 'unavailable', 'AppointmentOnly', 'PublicEvent', 'ClassPrivateEvent'];

  const appointmentOnlyMachines = [
    "Embroidery Machine",
    "Maker Wrangler: 3D Modeling",
    "3D Scanner: Spider",
    "3D Scanner: Leo",
    "Router: CNC",
    "Maker Wrangler",
    "PCB Milling Machine"
  ];

  machines.forEach(machine => {
    const nameCell = document.createElement('div');
    nameCell.className = 'machine-name';
    nameCell.textContent = machine;
    grid.appendChild(nameCell);

    timeSlots.forEach(() => {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell', 'slot');

      const initialState = appointmentOnlyMachines.includes(machine) ? 'AppointmentOnly' : 'available';
      cell.classList.add(initialState);

      cell.addEventListener('click', () => {
        let currentStateIndex = states.findIndex(state => cell.classList.contains(state));
        if (currentStateIndex === -1) currentStateIndex = 0;
        cell.classList.remove(states[currentStateIndex]);
        const nextStateIndex = (currentStateIndex + 1) % states.length;
        cell.classList.add(states[nextStateIndex]);
      });

      grid.appendChild(cell);
    });
  });
}

const timeToggle = document.getElementById('timeToggle');
timeToggle.addEventListener('change', () => {
  showThrough5pm = timeToggle.checked;
  buildGrid();
});

const queueNames = ["Example: #1234", "Example: #5678", "Example: #7654"];

function makeQueueReorderable() {
  const list = document.getElementById('printingQueue');
  let draggedItem = null;

  list.querySelectorAll('.queue-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      draggedItem = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      draggedItem = null;
      card.classList.remove('dragging');
    });

    card.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    card.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedItem && draggedItem !== card) {
        const rect = card.getBoundingClientRect();
        const offset = e.clientY - rect.top;
        const half = rect.height / 2;
        if (offset < half) {
          card.parentNode.insertBefore(draggedItem, card);
        } else {
          card.parentNode.insertBefore(draggedItem, card.nextSibling);
        }
      }
    });
  });
}

function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function populateQueue() {
  const queueList = document.getElementById('printingQueue');
  queueList.innerHTML = '';

  queueNames.forEach((name, index) => {
    const card = document.createElement('li');
    card.className = 'queue-card';
    card.draggable = true;

    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '☰';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = name;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '−';
    deleteBtn.addEventListener('click', () => {
    const i = queueNames.indexOf(name);
    if (i !== -1) {
        queueNames.splice(i, 1);
        populateQueue();
    }
    });


    const leftGroup = document.createElement('div');
    leftGroup.style.display = 'flex';
    leftGroup.style.alignItems = 'center';
    leftGroup.style.gap = '10px';

    leftGroup.appendChild(handle);
    leftGroup.appendChild(nameSpan);
    card.appendChild(leftGroup);
    card.appendChild(deleteBtn);
    queueList.appendChild(card);
  });

  makeQueueReorderable();
}

function addNewPrint() {
  const input = document.getElementById('newPrintName');
  const name = input.value.trim();
  if (name === '') return;

  queueNames.push(name);
  populateQueue();
  input.value = '';
  document.getElementById('addForm').style.display = 'none';
}

document.getElementById('clearButton').addEventListener('click', () => {
  const appointmentOnlyMachines = [
    "Embroidery Machine",
    "Maker Wrangler: 3D Modeling",
    "3D Scanner: Spider",
    "3D Scanner: Leo",
    "Router: CNC",
    "Maker Wrangler",
    "PCB Milling Machine"
  ];

  const grid = document.getElementById('bookingGrid');
  const children = Array.from(grid.children);
  const columnsPerRow = timeSlots.length + 1;

  for (let rowIndex = 0; rowIndex < machines.length; rowIndex++) {
    const machine = machines[rowIndex];
    const isAppointmentOnly = appointmentOnlyMachines.includes(machine);

    for (let colIndex = 1; colIndex <= timeSlots.length; colIndex++) {
      const cellIndex = (rowIndex + 1) * columnsPerRow + colIndex;
      const cell = children[cellIndex];
      if (!cell || !cell.classList.contains('slot')) continue;

      cell.classList.remove('available', 'unavailable', 'AppointmentOnly', 'PublicEvent', 'ClassPrivateEvent');
      cell.classList.add(isAppointmentOnly ? 'AppointmentOnly' : 'available');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleTimeButton');
  if (toggleBtn) {
    toggleBtn.textContent = "Show through 5'O Clock";
  }
  buildGrid();
  populateQueue();
});
