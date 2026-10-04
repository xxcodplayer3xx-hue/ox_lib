--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

---@alias IconProp 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fab' | 'fak' | 'fass'

local keepInput = IsNuiFocusKeepingInput()
local nuiFocusActive = false

function lib.setNuiFocus(allowInput, disableCursor)
    if not nuiFocusActive then
        keepInput = IsNuiFocusKeepingInput()
    end

    nuiFocusActive = true
    SetNuiFocus(true, not disableCursor)
    SetNuiFocusKeepInput(allowInput)
end

function lib.resetNuiFocus()
    nuiFocusActive = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(keepInput)
end

local function resetNuiFocusForPauseMenu()
    nuiFocusActive = false
    keepInput = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
end

CreateThread(function()
    local wasPauseMenuActive = false

    while true do
        local pauseMenuActive = IsPauseMenuActive()

        if pauseMenuActive and not wasPauseMenuActive then
            if lib.getOpenMenu and lib.getOpenMenu() then
                lib.hideMenu()
            end

            if lib.getOpenContextMenu and lib.getOpenContextMenu() then
                lib.hideContext()
            end

            if lib.getCurrentRadialId and lib.getCurrentRadialId() then
                lib.hideRadial()
            end

            if lib.isTextUIOpen and lib.isTextUIOpen() then
                lib.hideTextUI()
            end

            if lib.closeInputDialog then
                lib.closeInputDialog()
            end

            if lib.closeAlertDialog then
                lib.closeAlertDialog()
            end
        end

        if pauseMenuActive and (nuiFocusActive or IsNuiFocused() or IsNuiFocusKeepingInput()) then
            resetNuiFocusForPauseMenu()
        end

        wasPauseMenuActive = pauseMenuActive
        Wait(pauseMenuActive and 100 or 250)
    end
end)
