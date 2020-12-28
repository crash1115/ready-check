
// Register Game Settings
Hooks.once("init", function(){
  registerGameSettings();
});

// Reset Status When the Game is Ready
Hooks.once("ready", async function(){
  await setAllToNotReady();
});

// Set Up Buttons and Socket Stuff
Hooks.on('renderChatLog', async function(){
  createButtons();
  createSocketHandler();
});

// Update the display of the Player UI.
Hooks.on('renderPlayerList', async function(){
  await updatePlayersWindow();
})


// CREATE THE UI BUTTON FOR THE GM AND PLAYERS
function createButtons(){
  if(game.user.isGM){
    let checkBtnTitle = game.i18n.localize("READYCHECK.UiGmButton");
    const checkBtn = $(`<a class="ready-check" title="` + checkBtnTitle + `"><i class="fas fa-hourglass-half"></i></a>`);
    jQuery(".chat-control-icon").before(checkBtn);
    jQuery(".ready-check").click(async (event) => {
      event.preventDefault();
      displayGmDialog();
    });
  } else {
    let statusBtnTitle = game.i18n.localize("READYCHECK.UiChangeButton");
    const statusBtn = $(`<a class="ready-check" title="` + statusBtnTitle + `"><i class="fas fa-hourglass-half"></i></a>`);
    jQuery(".chat-control-icon").before(statusBtn);
    jQuery(".ready-check").click(async (event) => {
      event.preventDefault();
      displayStatusUpdateDialog();
    });
  }
}

// CREATE THE SOCKET HANDLER
function createSocketHandler(){
  game.socket.on('module.ready-check', async (data) =>{
    if(data.action === 'check'){
      displayReadyCheckDialog();
    }
    else if (data.action === 'update'){
      processReadyResponse(data);
    }
  });
}

// DISPLAY DIALOG ASKING GM WHAT THEY WANT TO DO
function displayGmDialog(){
  let buttons = {
    check: {icon: "<i class='fas fa-check'></i>",
            label: game.i18n.localize("READYCHECK.GmDialogButtonCheck"),
            callback: initReadyCheck
    },
    status: {icon: "<i class='fas fa-hourglass-half'></i>",
             label: game.i18n.localize("READYCHECK.GmDialogButtonStatus"),
             callback: displayStatusUpdateDialog
    }
  };
  new Dialog({
    title: game.i18n.localize("READYCHECK.GmDialogTitle"),
    content: game.i18n.localize("READYCHECK.GmDialogContent"),
    buttons: buttons,
    default: "check"
  }).render(true);
}

// DISPLAY A CHAT MESSAGE WHEN A USER RESPONDS TO A READY CHECK
function displayReadyCheckChatMessage(data){
  if(game.settings.get("ready-check", "showChatMessagesForChecks")){
    let username = game.users.get(data.userId).data.name;
    let content = `${username} ${game.i18n.localize("READYCHECK.ChatTextCheck")}`;
    ChatMessage.create({speaker:{alias: "Ready Set Go!"}, content: content});
  }
}

// DISPLAY READY CHECK DIALOG AND SEND RESPONSE TO GM (PLAYER)
function displayReadyCheckDialog(){
  let data = {action: 'update', ready: false, userId: game.user.data._id};
  let buttons = {
    yes: {icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize("READYCHECK.StatusReady"),
          callback: async () => { data.ready = true; updateReadyStatus(data); displayReadyCheckChatMessage(data); }
    }
  };

  new Dialog({
    title: game.i18n.localize("READYCHECK.DialogTitleReadyCheck"),
    content: game.i18n.localize("READYCHECK.DialogContentReadyCheck"),
    buttons: buttons,
    default: "yes"
  }).render(true);
}

// DISPLAY A CHAT MESSAGE WHEN A USER UPDATES THEIR STATUS
function displayStatusUpdateChatMessage(data){
  if(game.settings.get("ready-check", "showChatMessagesForUserUpdates")){
    let username = game.users.get(data.userId).data.name;
    let status = data.ready ? game.i18n.localize("READYCHECK.StatusReady") : game.i18n.localize("READYCHECK.StatusNotReady");
    let content = `${username} ${game.i18n.localize("READYCHECK.ChatTextUserUpdate")} ${status}`;
    ChatMessage.create({speaker:{alias: "Ready Set Go!"}, content: content});
  }
}

// DISPLAY STATUS UPDATE DIALOG AND SEND RESPONSE TO GM
function displayStatusUpdateDialog(){
  let data = {action: 'update', ready: false, userId: game.user.data._id};
  let buttons = {
    yes: {icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize("READYCHECK.StatusReady"),
          callback: () => { data.ready = true; updateReadyStatus(data); displayStatusUpdateChatMessage(data);}
    },
    no:  {icon: "<i class='fas fa-times'></i>",
          label: game.i18n.localize("READYCHECK.StatusNotReady"),
          callback: () => { data.ready = false; updateReadyStatus(data); displayStatusUpdateChatMessage(data);}
    }
  };

  new Dialog({
    title: game.i18n.localize("READYCHECK.DialogTitleStatusUpdate"),
    content: game.i18n.localize("READYCHECK.DialogContentStatusUpdate"),
    buttons: buttons,
    default: "yes"
  }).render(true);
}

// INITIATE A READY CHECK (GM)
async function initReadyCheck(){
  if(game.user.isGM){
    let data = {action: 'check'};
    await setAllToNotReady();
    game.socket.emit('module.ready-check', data);
    displayReadyCheckDialog();
  } else {
    ui.notifications.error(game.i18n.localize("READYCHECK.ErrorNotGM"));
  }

}

// PROCESS READY CHECK RESPONSE (GM)
async function processReadyResponse(data){
  if(game.user.isGM){
    let userToUpdate = game.users.get(data.userId);
    await userToUpdate.setFlag('ready-check', 'isReady', data.ready);
    ui.players.render();
  }
}

// REGISTER GAME Settings
function registerGameSettings(){
  game.settings.register("ready-check", "showChatMessagesForUserUpdates", {
    name: game.i18n.localize("READYCHECK.SettingsChatMessagesForUserUpdatesTitle"),
    hint: game.i18n.localize("READYCHECK.SettingsChatMessagesForUserUpdatesHint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("ready-check", "showChatMessagesForChecks", {
    name: game.i18n.localize("READYCHECK.SettingsChatMessagesForChecksTitle"),
    hint: game.i18n.localize("READYCHECK.SettingsChatMessagesForChecksHint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });
}

// SET ALL USERS STATUS TO NOT READY (GM)
async function setAllToNotReady(){
  if(game.user.isGM){
    for(var i=0; i < game.users.entities.length; i++){
      await game.users.entities[i].setFlag('ready-check','isReady', false);
    }
  }
}

// UPDATE PLAYER UI
async function updatePlayersWindow(){
  for(var i=0; i < game.users.entities.length; i++){
    let ready = await game.users.entities[i].getFlag('ready-check','isReady');
    let userId = game.users.entities[i].data._id;
    let userName = game.users.entities[i].data.name;
    let title, indicator;

    if(ready){
      title = game.i18n.localize("READYCHECK.PlayerReady");
      indicator = `<i class="fas fa-check ready-indicator ready" title="` + title + `"></i>`;
    } else {
      title = game.i18n.localize("READYCHECK.PlayerNotReady");
      indicator = `<i class="fas fa-times ready-indicator not-ready" title="` + title + `"></i>`;
    }

    $("#players").find("[data-user-id="+userId+"]").append(indicator);
  }
}

// UPDATE USER READY STATUS
//  If the user is a GM, just update it since the socket go to the sender, and none of the recipients (players)
//  will have the permissions require to update user flags. If the user is not a GM, emit that socket.
async function updateReadyStatus(data){
  if(game.user.isGM){
    processReadyResponse(data);
  } else {
    game.socket.emit('module.ready-check', data);
  }
}
