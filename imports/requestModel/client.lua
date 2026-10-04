--[[
    https://github.com/overextended/ox_lib

    This file is licensed under LGPL-3.0 or higher <https://www.gnu.org/licenses/lgpl-3.0.en.html>

    Copyright © 2025 Linden <https://github.com/thelindat>
]]

---Load a model. When called from a thread, it will yield until it has loaded.
---@param model number | string
---@param timeout number? Approximate milliseconds to wait for the model to load. Default is 10000.
---@return number model
function lib.requestModel(model, timeout)
    local originalModel = model

    if type(model) == 'string' then
        if model == '' then
            error('attempted to load an empty model name')
        end

        model = joaat(model)
    elseif type(model) ~= 'number' then
        error(("attempted to load model with invalid type '%s'"):format(type(model)))
    end

    if HasModelLoaded(model) then return model end

    if not IsModelValid(model) and not IsModelInCdimage(model) then
        local resource = GetInvokingResource() or GetCurrentResourceName()
        error(("resource '%s' attempted to load invalid model '%s' (hash %s); use a valid model name/hash and ensure any custom model resource is started"):format(resource, tostring(originalModel), tostring(model)))
    end

    return lib.streamingRequest(RequestModel, HasModelLoaded, 'model', model, timeout)
end

return lib.requestModel
