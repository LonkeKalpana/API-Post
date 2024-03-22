const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

let db = null

const dbpath = path.join(__dirname, 'cricketTeam.db')
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      // console.log('hello world')
    })
  } catch (e) {
    console.log(`server stopped ${e.message}`)
    process.exit(1)
  }
}

intializeDBAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

//                                                  API 1
app.get('/players/', async (request, response) => {
  const getPlayerDetails = `select * from cricket_team;`
  const playerArray = await db.all(getPlayerDetails)
  response.send(
    playerArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

//                                                  API 2
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  //console.log(playerDetails)
  const {playerName, jerseyNumber, role} = playerDetails
  //console.log('item added')
  const playerData = `insert into cricket_team (playerName, jerseyNumber,role) values ('${playerName}',${jerseyNumber},'${role})';`
  //console.log(playerData)

  const dbResponse = await db.run(playerData)

  const playerId = dbResponse.lastID
  console.log(playerId)

  response.send({player_id: playerId})

  //response.send('Player Added to Team')
})

//                                     API 3
/*app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getSQLQuery = `select * from cricket_team where playerID=${playerID};`
  const dbQuery = await db.run(getSQLQuery)
  response.send(dbQuery)
})

app.put("/players/:playerId/",await(request,response)=>
{
  const {playerId}=request.params;
  const playerDetails=request.body;
  const {}

})
*/
