import Link from 'components/general/Link'
import NavbarDropdown from 'components/general/NavbarDropdown'
import NavbarItem from 'components/general/NavbarItem'
import NavbarLanguage from 'components/general/NavbarLanguage'
import NavbarPair from 'components/general/NavbarPair'
import Dinero from "dinero.js"
import { IMarketToken } from 'utils/Interfaces'

import * as S from './styles'
const testPairs = [
  {
    id: 1,
    name: "USDT"
  },
]

type BlockProps = {
  volume: number;
  high: string;
  low: string;
  blockPrice: string;
}

type Props = {
  blockValues: BlockProps,
  lastTradePrice: number,
  lastTradePriceType: 'AskLimit' | 'BidLimit'
}
const Navbar = ({ blockValues, lastTradePrice, lastTradePriceType }: Props) => {
  return (
  <S.Wrapper>
    <S.WrapperInfo>
      <S.ContainerPair>
          <NavbarPair coin={'BTC'} pairs={testPairs} />
      </S.ContainerPair>
      <S.ContainerInfo>
        <NavbarItem label="Last Trade Price (USDT)" info={Dinero({ amount: Math.round(lastTradePrice * 100) }).toFormat('$0,0.00')} type={lastTradePriceType} />
        <NavbarItem label="Block Price %" info={blockValues.blockPrice} />
        <NavbarItem label="Block Volume (USDT)" info={Dinero({ amount: Math.round(blockValues.volume * 100) }).toFormat('$0').toString().slice(0, 6)} />
        <S.WrapperVolume>
          <S.VolumeHigh>
            <S.Span>
              Block High
            </S.Span>
            <p>
              {blockValues.high}
            </p>
          </S.VolumeHigh>
          <S.VolumeLow>
            <S.Span>
              Block Low
            </S.Span>
            <p>
              {blockValues.low}
            </p>
          </S.VolumeLow>

        </S.WrapperVolume>
      </S.ContainerInfo>
    </S.WrapperInfo>
    <S.WrapperLinks>
      <Link title="Market" href="#" />
      <NavbarDropdown title="Trade">
      </NavbarDropdown>
      <NavbarDropdown title="Derivatives">
      </NavbarDropdown>
      <NavbarDropdown title="Finance">
      </NavbarDropdown>
      <NavbarLanguage />

    </S.WrapperLinks>
  </S.Wrapper>
)
}

export default Navbar
