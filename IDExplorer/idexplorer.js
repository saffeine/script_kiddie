function file_put_contents(path, contents){
    var fs = (new ActiveXObject("Scripting.FileSystemObject"));
    var file = fs.OpenTextFile(path, 2, true, 0);
    try{ file.Write(contents); }catch(error){ console.log(error); };
    file.Close();
    return;
}

function file_get_contents(path){
    var fs = (new ActiveXObject("Scripting.FileSystemObject"));
    var file = fs.OpenTextFile(path, 1);
    var result = "";
    try{ result = file.ReadAll(); }catch(error){ console.log(error); };
    file.Close();
    return result;
}

ide = {
    rootFolder: 'C:\\idexplorer\\',
    currentFile: null,
    workspace: null,

    initialise: function(){
        var editor = document.getElementById('ide-editor');
        editor.addEventListener('keydown', ide.__editorKeyDown);
    },



    switchWorkspace: function(workspace){
        if(workspace != null){ this.saveWorkspace(); }
        this.workspace = workspace;
        this.openWorkspace();
        return;
    },

    openWorkspace: function(){
        var fs = (new ActiveXObject("Scripting.FileSystemObject"));
        var files = (new Enumerator(fs.GetFolder(this.rootFolder + this.workspace + "\\").Files));
        var links = document.getElementById("ide-sidebar-links");
        links.innerHTML = "";

        for(;!files.atEnd();files.moveNext()){
            var name = files.item().Name;
            var newA = document.createElement("a");
            newA.href = "javascript: ide.openFile('"+name+"'); void(0);";
            newA.innerText = name;
            links.appendChild(newA);
        }

        return;
    },

    saveWorkspace: function(){
        var editor = document.getElementById('ide-editor');
        if(this.currentFile != null){ file_put_contents(this.getFilePath(), editor.innerText)}
    },



    openFile: function(filename){
        var editor = document.getElementById('ide-editor');
        var text = "";
        if(this.currentFile != null){ this.saveFile(); }
        this.currentFile = filename;
        text = file_get_contents(this.getFilePath());
        editor.innerText = ide.trimFat(text);
        return true;
    },

    saveFile: function(){
        var editor = document.getElementById('ide-editor');
        var text = ide.trimFat(editor.innerHTML);
        file_put_contents(this.getFilePath(), text);
        return true;
    },

    getFilePath: function(){
        return this.rootFolder + this.workspace + "\\" + this.currentFile;
    },



    trimFat: function(value){
        while(value.indexOf('<p>') != -1){ value = value.replace('<p>', ''); }
        while(value.indexOf('</p>') != -1){ value = value.replace('</p>', '\n'); }
        while(value.indexOf('<br>') != -1){ value = value.replace('<br>', '\n'); }
        return value;
    },

    updateDimensions: function() {
        var sidebar = document.getElementById('ide-sidebar');
        var filetray = document.getElementById('ide-filetray');
        var editor = document.getElementById('ide-editor');
        
        var scrW = window.innerWidth;
        var scrH = window.innerHeight;

        var px = function(value){ return String(value) + "px"; }

        var xSide = { width: 160, height: scrH };
        var xTray = { width: scrW - xSide.width, height: 32 };
        var xEditor = { width: scrW - xSide.width, height: scrH - xTray.height };

        sidebar.style.top = px(0);
        sidebar.style.left = px(0);
        sidebar.style.width = px(xSide.width);
        sidebar.style.height = px(xSide.height);

        filetray.style.top = px(scrH - xTray.height);
        filetray.style.left = px(xSide.width);
        filetray.style.width = px(xTray.width);
        filetray.style.height = px(xTray.height);

        editor.style.top = px(0);
        editor.style.left = px(xSide.width);
        editor.style.width = px(xEditor.width);
        editor.style.height = px(xEditor.height);

        return;
    },

    __editorKeyDown: function(e){
        var editor = document.getElementById('ide-editor');

        var insertChar__ = function(char){
            e.preventDefault();
            
            var sel = window.getSelection();
            var rng = sel.getRangeAt(0);
            var tab = document.createTextNode(char);
            rng.insertNode(tab);

            rng.setStartAfter(tab);
            rng.setEndAfter(tab);
            sel.removeAllRanges();
            sel.addRange(rng);
        }

        var enter_ = function(){
            var editor = document.getElementById('ide-editor');
            insertChar__("<br>");
        }

        var tab_ = function(){
            insertChar__("        ");
        }

        var f5_ = function(){
            e.preventDefault();
            try { eval(editor.innerText); }catch(error){};
            return;
        }

        switch(e.keyCode){
            case 9: tab_(); break;
            case 116: f5_(); break;
            default: console.log(e.keyCode); break;
        }
        
        return;
    }
}