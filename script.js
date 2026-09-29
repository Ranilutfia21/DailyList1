/* =====================================================
   DATA
===================================================== */

let tasks =
    JSON.parse(localStorage.getItem("dailyListTasks")) || [];

let archivedTasks =
    JSON.parse(localStorage.getItem("dailyListArchived")) || [];

let notes =
    JSON.parse(localStorage.getItem("dailyListNotes")) || [];


/* =====================================================
   ELEMENT
===================================================== */

const taskModal =
    document.getElementById("taskModal");

const taskInput =
    document.getElementById("taskInput");

const taskContainer =
    document.getElementById("taskContainer");

const notesContainer =
    document.getElementById("notesContainer");

const noteInput =
    document.getElementById("noteInput");

const archiveModal =
    document.getElementById("archiveModal");

const archiveContainer =
    document.getElementById("archiveContainer");

const addTaskButton =
    document.getElementById("addTaskButton");

const archiveButton =
    document.getElementById("archiveButton");


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveData() {

    localStorage.setItem(
        "dailyListTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "dailyListArchived",
        JSON.stringify(archivedTasks)
    );

    localStorage.setItem(
        "dailyListNotes",
        JSON.stringify(notes)
    );
}


/* =====================================================
   HALAMAN
===================================================== */

function changePage(pageId, button) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }


    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");


    /* Tombol tambah tugas */

    if (pageId === "tasksPage") {

        addTaskButton.style.display = "block";

        archiveButton.style.display = "block";

    } else {

        addTaskButton.style.display = "none";

        archiveButton.style.display = "none";

    }


    /* Jika masuk halaman coretan */

    if (pageId === "drawingPage") {

        setTimeout(() => {

            resizeCanvas();

            redrawCanvas();

        }, 50);

    }

}


/* =====================================================
   TAMBAH TUGAS
===================================================== */

function openTaskModal() {

    taskModal.classList.add("show");

    taskInput.value = "";

    setTimeout(() => {

        taskInput.focus();

    }, 100);

}


function closeTaskModal() {

    taskModal.classList.remove("show");

}


function addTask() {

    const taskName =
        taskInput.value.trim();


    if (taskName === "") {

        alert(
            "Silakan masukkan nama tugas."
        );

        return;

    }


    tasks.push({

        name: taskName,

        isChecked: false

    });


    saveData();

    renderTasks();

    closeTaskModal();

}


/* =====================================================
   ENTER TAMBAH TUGAS
===================================================== */

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();

        }

    }
);


/* =====================================================
   TAMPILKAN TUGAS
===================================================== */

function renderTasks() {

    taskContainer.innerHTML = "";


    if (tasks.length === 0) {

        taskContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📝
                </div>

                <p>
                    Mulailah menjadwalkan tugas-tugas Anda
                    agar lebih produktif
                </p>

            </div>

        `;

        return;

    }


    tasks.forEach((task, index) => {

        const taskElement =
            document.createElement("div");

        taskElement.className =
            "task-item";


        taskElement.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.isChecked ? "checked" : ""}
                onchange="completeTask(${index})"
            >

            <span class="task-name">
                ${escapeHTML(task.name)}
            </span>

            <button
                class="delete-task"
                onclick="removeTask(${index})"
                title="Hapus tugas">
                🗑
            </button>

        `;


        taskContainer.appendChild(
            taskElement
        );

    });

}


/* =====================================================
   SELESAIKAN TUGAS
===================================================== */

function completeTask(index) {

    const task = tasks[index];

    if (!task) {
        return;
    }


    task.isChecked = true;

    archivedTasks.push(task);

    tasks.splice(index, 1);


    saveData();

    renderTasks();

}


/* =====================================================
   HAPUS TUGAS
===================================================== */

function removeTask(index) {

    if (
        confirm(
            "Apakah Anda yakin ingin menghapus tugas ini?"
        )
    ) {

        tasks.splice(index, 1);

        saveData();

        renderTasks();

    }

}


/* =====================================================
   CATATAN
===================================================== */

function addNote() {

    const noteText =
        noteInput.value.trim();


    if (noteText === "") {

        alert(
            "Silakan tulis catatan terlebih dahulu."
        );

        return;

    }


    notes.push(noteText);

    noteInput.value = "";


    saveData();

    renderNotes();

}


function renderNotes() {

    notesContainer.innerHTML = "";


    if (notes.length === 0) {

        notesContainer.innerHTML = `

            <div class="empty-notes">
                Belum ada catatan
            </div>

        `;

        return;

    }


    notes.forEach((note, index) => {

        const noteElement =
            document.createElement("div");

        noteElement.className =
            "note-item";


        noteElement.innerHTML = `

            <div class="note-text">
                ${escapeHTML(note)}
            </div>

            <button
                class="delete-note"
                onclick="removeNote(${index})"
                title="Hapus catatan">
                🗑
            </button>

        `;


        notesContainer.appendChild(
            noteElement
        );

    });

}


function removeNote(index) {

    if (
        confirm(
            "Apakah Anda yakin ingin menghapus catatan ini?"
        )
    ) {

        notes.splice(index, 1);

        saveData();

        renderNotes();

    }

}


/* =====================================================
   ARSIP
===================================================== */

function openArchive() {

    archiveModal.classList.add("show");

    renderArchive();

}


function closeArchive() {

    archiveModal.classList.remove("show");

}


function renderArchive() {

    archiveContainer.innerHTML = "";


    if (archivedTasks.length === 0) {

        archiveContainer.innerHTML = `

            <div class="empty-archive">
                Tidak ada arsip.
            </div>

        `;

        return;

    }


    archivedTasks.forEach(task => {

        const archiveItem =
            document.createElement("div");

        archiveItem.className =
            "archive-item";

        archiveItem.textContent =
            task.name;

        archiveContainer.appendChild(
            archiveItem
        );

    });

}


/* =====================================================
   HAPUS SEMUA ARSIP
===================================================== */

function clearArchive() {

    if (archivedTasks.length === 0) {
        return;
    }


    const confirmDelete =
        confirm(
            "Apakah Anda yakin ingin menghapus semua arsip?"
        );


    if (!confirmDelete) {
        return;
    }


    archivedTasks = [];


    saveData();

    renderArchive();

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =====================================================
   ================= COREtan ===========================
===================================================== */

const canvas =
    document.getElementById("drawingCanvas");

const ctx =
    canvas.getContext("2d");


/*
   Setiap coretan disimpan sebagai satu objek.

   Contoh:

   stroke 1 = garis pertama
   stroke 2 = garis kedua
   stroke 3 = garis ketiga

   Jadi ketika menggunakan penghapus,
   kita dapat menghapus hanya stroke
   yang disentuh.
*/

let strokes = [];

let currentStroke = null;

let drawing = false;

let currentTool = "brush";

let currentColor = "#222222";

let currentBrushSize = 5;


/* =====================================================
   UKURAN CANVAS
===================================================== */

function resizeCanvas() {

    if (!canvas) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    if (
        rect.width <= 0 ||
        rect.height <= 0
    ) {
        return;
    }


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;


    /*
       Setelah canvas diubah ukurannya,
       koordinat gambar kembali menggunakan
       ukuran CSS.
    */

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    ctx.lineCap = "round";

    ctx.lineJoin = "round";


    redrawCanvas();

}


/* =====================================================
   GAMBAR ULANG SEMUA COREtan
===================================================== */

function redrawCanvas() {

    if (!canvas) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );


    strokes.forEach(stroke => {

        if (
            !stroke.points ||
            stroke.points.length < 2
        ) {
            return;
        }


        ctx.beginPath();


        ctx.strokeStyle =
            stroke.color;

        ctx.lineWidth =
            stroke.size;

        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";


        ctx.moveTo(
            stroke.points[0].x,
            stroke.points[0].y
        );


        for (
            let i = 1;
            i < stroke.points.length;
            i++
        ) {

            ctx.lineTo(
                stroke.points[i].x,
                stroke.points[i].y
            );

        }


        ctx.stroke();

    });

}


/* =====================================================
   POSISI POINTER
===================================================== */

function getPointerPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x: event.clientX - rect.left,

        y: event.clientY - rect.top

    };

}


/* =====================================================
   PILIH WARNA
===================================================== */

function selectColor(color, button) {

    currentColor = color;


    const buttons =
        document.querySelectorAll(
            ".color-button"
        );


    buttons.forEach(item => {

        item.classList.remove("active");

    });


    button.classList.add("active");


    /*
       Setelah memilih warna,
       otomatis kembali ke mode kuas.
    */

    setDrawingTool("brush");

}


/* =====================================================
   UKURAN KUAS
===================================================== */

function changeBrushSize(size) {

    currentBrushSize =
        Number(size);

}


/* =====================================================
   PILIH TOOL
===================================================== */

function setDrawingTool(tool) {

    currentTool = tool;


    const brushTool =
        document.getElementById("brushTool");

    const eraserTool =
        document.getElementById("eraserTool");


    brushTool.classList.remove("active");

    eraserTool.classList.remove("active");


    canvas.classList.remove(
        "eraser-mode"
    );


    if (tool === "brush") {

        brushTool.classList.add(
            "active"
        );

        canvas.classList.remove(
            "eraser-mode"
        );

    }


    if (tool === "eraser") {

        eraserTool.classList.add(
            "active"
        );

        canvas.classList.add(
            "eraser-mode"
        );

    }

}


/* =====================================================
   MULAI POINTER
===================================================== */

canvas.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();


        const position =
            getPointerPosition(event);


        /*
           Jika mode penghapus,
           cari coretan yang disentuh.
        */

        if (currentTool === "eraser") {

            deleteStrokeAt(
                position.x,
                position.y
            );

            return;

        }


        /* MODE KUAS */

        drawing = true;


        currentStroke = {

            color: currentColor,

            size: currentBrushSize,

            points: [

                {
                    x: position.x,
                    y: position.y
                }

            ]

        };


        strokes.push(
            currentStroke
        );


        canvas.setPointerCapture(
            event.pointerId
        );

    }
);


/* =====================================================
   POINTER MOVE
===================================================== */

canvas.addEventListener(
    "pointermove",
    function(event) {

        if (!drawing) {
            return;
        }


        if (
            currentTool !== "brush"
        ) {
            return;
        }


        event.preventDefault();


        const position =
            getPointerPosition(event);


        currentStroke.points.push({

            x: position.x,

            y: position.y

        });


        /*
           Gambar hanya segmen terbaru
           agar lebih ringan.
        */

        const points =
            currentStroke.points;


        const previous =
            points[points.length - 2];


        ctx.beginPath();


        ctx.strokeStyle =
            currentStroke.color;

        ctx.lineWidth =
            currentStroke.size;

        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";


        ctx.moveTo(
            previous.x,
            previous.y
        );


        ctx.lineTo(
            position.x,
            position.y
        );


        ctx.stroke();

    }
);


/* =====================================================
   POINTER UP
===================================================== */

canvas.addEventListener(
    "pointerup",
    function(event) {

        drawing = false;

        currentStroke = null;


        if (
            canvas.hasPointerCapture(
                event.pointerId
            )
        ) {

            canvas.releasePointerCapture(
                event.pointerId
            );

        }

    }
);


canvas.addEventListener(
    "pointercancel",
    function() {

        drawing = false;

        currentStroke = null;

    }
);


/* =====================================================
   HAPUS SATU COREtan
===================================================== */

function deleteStrokeAt(x, y) {

    /*
       Semakin besar nilainya,
       semakin mudah penghapus
       menemukan garis.
    */

    const hitDistance = 15;


    /*
       Mulai dari coretan paling akhir.
       Ini penting karena coretan terakhir
       biasanya berada paling atas.
    */

    for (
        let i = strokes.length - 1;
        i >= 0;
        i--
    ) {

        const stroke =
            strokes[i];


        if (
            isPointNearStroke(
                x,
                y,
                stroke,
                hitDistance
            )
        ) {

            /*
               Hapus hanya satu coretan.
            */

            strokes.splice(i, 1);


            redrawCanvas();

            return;

        }

    }

}


/* =====================================================
   CEK APAKAH TITIK MENYENTUH COREtan
===================================================== */

function isPointNearStroke(
    x,
    y,
    stroke,
    distance
) {

    const points =
        stroke.points;


    if (!points || points.length === 0) {
        return false;
    }


    /*
       Jika coretan hanya satu titik.
    */

    if (points.length === 1) {

        const dx =
            x - points[0].x;

        const dy =
            y - points[0].y;

        return (
            Math.sqrt(
                dx * dx +
                dy * dy
            ) <= distance
        );

    }


    /*
       Periksa setiap segmen garis.
    */

    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {

        const p1 =
            points[i];

        const p2 =
            points[i + 1];


        const d =
            distanceToSegment(
                x,
                y,
                p1.x,
                p1.y,
                p2.x,
                p2.y
            );


        if (
            d <=
            distance +
            stroke.size / 2
        ) {

            return true;

        }

    }


    return false;

}


/* =====================================================
   JARAK TITIK KE GARIS
===================================================== */

function distanceToSegment(
    px,
    py,
    x1,
    y1,
    x2,
    y2
) {

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    if (
        dx === 0 &&
        dy === 0
    ) {

        return Math.sqrt(

            Math.pow(
                px - x1,
                2
            )

            +

            Math.pow(
                py - y1,
                2
            )

        );

    }


    const t =
        Math.max(
            0,
            Math.min(
                1,
                (
                    (px - x1) * dx +
                    (py - y1) * dy
                )
                /
                (dx * dx + dy * dy)
            )
        );


    const closestX =
        x1 + t * dx;

    const closestY =
        y1 + t * dy;


    return Math.sqrt(

        Math.pow(
            px - closestX,
            2
        )

        +

        Math.pow(
            py - closestY,
            2
        )

    );

}


/* =====================================================
   HAPUS SEMUA COREtan
===================================================== */

function clearDrawing() {

    if (strokes.length === 0) {
        return;
    }


    const confirmClear =
        confirm(
            "Apakah Anda ingin menghapus semua coretan?"
        );


    if (!confirmClear) {
        return;
    }


    strokes = [];


    redrawCanvas();

}


/* =====================================================
   MODAL KLIK DI LUAR
===================================================== */

taskModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === taskModal
        ) {

            closeTaskModal();

        }

    }
);


/* =====================================================
   ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeTaskModal();

            closeArchive();

        }

    }
);


/* =====================================================
   RESIZE WINDOW
===================================================== */

window.addEventListener(
    "resize",
    function() {

        if (
            document
                .getElementById("drawingPage")
                .classList.contains("active")
        ) {

            resizeCanvas();

        }

    }
);


/* =====================================================
   LOAD DATA
===================================================== */

renderTasks();

renderNotes();


/*
   Jangan langsung resize canvas
   sebelum layout selesai.
*/

setTimeout(() => {

    resizeCanvas();

}, 100);