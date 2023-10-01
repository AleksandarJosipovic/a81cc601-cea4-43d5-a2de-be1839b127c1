import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useState, useEffect } from 'react'

let submitForm = false
let tilgungsList: [] | any = []

function TilgunsPlan() {
  const [values, setValues] = useState({
    'tilgungs-dauer': '1',
    'darlehens-betrag': '',
    'sollzins-satz': '',
    'tilgung-prozent': '',
  })
  const [rows, rowChange] = useState([])

  const onInputChange = (event: any) => {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })

    event.preventDefault()
  }
  const ziensenTeil = (darlehens_betrag: number | any, sollzins_satz: number | any) => {
    return (darlehens_betrag / 100) * sollzins_satz
  }
  const tilgungsAnteil = (darlehens_betrag: number | any, tilgungssatz: number | any) => {
    return (darlehens_betrag / 100) * tilgungssatz
  }
  const tilgungsAnteilNeu = (annuity: number | any, ziensenteil: number | any) => {
    return annuity - ziensenteil
  }
  const annuiteat = (ziensenteil: number | any, tilgungssatz: number | any) => {
    return ziensenteil + tilgungssatz
  }
  const restSchuld = (darlehens_betrag: number | any, tilgungssatz: number | any) => {
    return darlehens_betrag - tilgungssatz
  }

  const handelSubmit = (event: any) => {
    let darlehens_betrag = parseFloat(values['darlehens-betrag']) // Darlehensbetrag
    let sollzins_satz = parseFloat(values['sollzins-satz']) // Zinssatz
    let tilgungs_dauer = parseFloat(values['tilgungs-dauer']) // Tilgungsdauer
    let tilgungs_satz = parseFloat(values['tilgung-prozent']) // Tilgungssatz

    let ziensenteil = ziensenTeil(darlehens_betrag, sollzins_satz) // calculate Ziensenteil
    let tilgungsanteil = tilgungsAnteil(darlehens_betrag, tilgungs_satz) // calculate Tilgungsanteil
    let annuity = annuiteat(ziensenteil, tilgungsanteil) // calculate Annuität

    tilgungsList = [] // clear the list

    //
    let createTilgungsList = createData(0, sollzins_satz, annuity, ziensenteil, tilgungsanteil, darlehens_betrag)
    tilgungsList.push(createTilgungsList)

    handleTilgungList(tilgungs_dauer, darlehens_betrag, tilgungsanteil, sollzins_satz, ziensenteil, annuity)

    submitForm = true

    event.preventDefault()
  }
  const handleTilgungList = (
    tilgungs_dauer: number,
    darlehens_betrag: string | any,
    tilgungsanteil: string | number,
    sollzins_satz: string | any,
    ziensenteil: string | number,
    annuity: string | any
  ) => {
    for (let index = 1; index <= tilgungs_dauer; index++) {
      let restschuld = restSchuld(darlehens_betrag, tilgungsanteil)

      ziensenteil = ziensenTeil(restschuld, sollzins_satz)

      let tilgungsanteilneu = tilgungsAnteilNeu(annuity, ziensenteil)
      annuity = annuiteat(ziensenteil, tilgungsanteil)
      tilgungsanteil = tilgungsanteilneu
      darlehens_betrag = restschuld
      annuity = annuiteat(ziensenteil, tilgungsanteil)

      let createTilgungsList = createData(
        index,
        sollzins_satz,
        annuity,
        Number(ziensenteil).toFixed(3),
        Number(tilgungsanteil).toFixed(3),
        Number(restschuld).toFixed(1)
      )
      tilgungsList.push(createTilgungsList)
    }
    rowChange(tilgungsList)
  }
  function createData(
    jahr: number,
    sollzins_satz: number,
    annuity: number,
    ziensenteil: number | string,
    tilgungsanteil: number | string,
    restschuld: number | string
  ) {
    return { jahr, sollzins_satz, annuity, ziensenteil, tilgungsanteil, restschuld }
  }

  useEffect(() => {}, [rows])
  useEffect(() => {
    let darlehens_betrag = parseFloat(values['darlehens-betrag']) // Darlehensbetrag
    let sollzins_satz = parseFloat(values['sollzins-satz']) // Zinssatz
    let tilgungs_dauer = parseFloat(values['tilgungs-dauer']) // Tilgungsdauer
    let tilgungs_satz = parseFloat(values['tilgung-prozent']) // Tilgungssatz

    if (darlehens_betrag && sollzins_satz && tilgungs_dauer && tilgungs_satz && submitForm) {
      let ziensenteil = ziensenTeil(darlehens_betrag, sollzins_satz) // calculate Ziensenteil
      let tilgungsanteil = tilgungsAnteil(darlehens_betrag, tilgungs_satz) // calculate Tilgungsanteil
      let annuity = annuiteat(ziensenteil, tilgungsanteil) // calculate Annuität

      tilgungsList = []

      let createTilgungsList = createData(0, sollzins_satz, annuity, ziensenteil, tilgungsanteil, darlehens_betrag)
      tilgungsList.push(createTilgungsList)
      handleTilgungList(tilgungs_dauer, darlehens_betrag, tilgungsanteil, sollzins_satz, ziensenteil, annuity)
    }
  }, [values])

  return (
    <section className="">
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        autoComplete="off"
        onSubmit={handelSubmit}
      >
        <FormControl fullWidth>
          <InputLabel id="tilgungs-dauer-label">Tilgungsdauer</InputLabel>
          <Select
            labelId="tilgungs-dauer-label"
            id="tilgungs-dauer"
            value={values['tilgungs-dauer']}
            name="tilgungs-dauer"
            label="Tilgungsdauer"
            onChange={onInputChange}
            required
          >
            {Array.from(Array(30).keys()).map((item, index) => (
              <MenuItem value={++index} key={index}>
                {++item} <span style={{ padding: '0 10px' }}>{item === 1 ? ' Jahr' : ' Jahren'}</span>{' '}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          onChange={onInputChange}
          value={values['darlehens-betrag']}
          name="darlehens-betrag"
          id="darlehens-betrag"
          label="Darlehensbetrag"
          variant="outlined"
        />
        <TextField
          onChange={onInputChange}
          value={values['sollzins-satz']}
          name="sollzins-satz"
          id="sollzins-satz"
          label="Sollzinssatz"
          variant="outlined"
          required
        />
        <TextField
          onChange={onInputChange}
          value={values['tilgung-prozent']}
          name="tilgung-prozent"
          id="tilgung-prozent"
          label="Anfängliche Tilgung (%)"
          variant="outlined"
          required
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
      <div className="" style={{ padding: '20px 30px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Jahr</TableCell>
                <TableCell align="right">Zinssatz</TableCell>
                <TableCell align="right">Annuität</TableCell>
                <TableCell align="right">Zinsanteil €</TableCell>
                <TableCell align="right">Tilgungsanteil €</TableCell>
                <TableCell align="right">Restschuld €</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row.jahr} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.jahr}
                  </TableCell>
                  <TableCell align="right">{row.sollzins_satz}</TableCell>
                  <TableCell align="right">{row.annuity}</TableCell>
                  <TableCell align="right">{row.ziensenteil}</TableCell>
                  <TableCell align="right">{row.tilgungsanteil}</TableCell>
                  <TableCell align="right">{row.restschuld}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  )
}

export default TilgunsPlan
