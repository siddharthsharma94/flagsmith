import { Component } from 'react'
import Paging from '../Paging'
import Panel from './Panel'
import Row from '../base/grid/Row'
import { Utils } from 'common/utils'
import Column from '../base/grid/Column'
import { filter } from 'lodash'

const PanelSearch = class extends Component {
  static displayName = 'PanelSearch'

  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  filter() {
    const { search } = this.state
    const { items, filterRow } = this.props
    if (filterRow && search) {
      return filter(items, (i) => filterRow(i, search.toLowerCase()))
    }
    return items
  }

  render() {
    const { search } = this.state
    const { items, renderRow, renderNoResults, paging, goToPage, isLoading } =
      this.props
    const filteredItems = this.filter(items)
    return !search &&
      (!filteredItems || !filteredItems.length) &&
      !this.props.renderSearchWithNoResults ? (
      renderNoResults
    ) : (
      <Panel
        className={this.props.className}
        title={this.props.title}
        icon={this.props.icon}
        action={
          this.props.filterRow ? (
            <Row onClick={() => this.input.focus()}>
              <input
                ref={(c) => (this.input = c)}
                onChange={(e) =>
                  this.props.onChange
                    ? this.props.onChange(e)
                    : this.setState({
                        search: Utils.safeParseEventValue(e),
                      })
                }
                type='text'
                value={this.props.search || search}
              />
              <span
                style={{ marginLeft: 10, position: 'absolute' }}
                className='icon fa fa-search'
              />
            </Row>
          ) : null
        }
      >
        {!!paging && (
          <Paging paging={paging} isLoading={isLoading} goToPage={goToPage} />
        )}
        <div
          id={this.props.id}
          className='search-list'
          style={isLoading ? { opacity: 0.5 } : {}}
        >
          {filteredItems && filteredItems.length ? (
            filteredItems.map(renderRow)
          ) : renderNoResults && !search ? (
            renderNoResults
          ) : (
            <Column>
              <div>
                {'No results '}
                {search && (
                  <span>
                    for
                    <strong>{` "${search}"`}</strong>
                  </span>
                )}
              </div>
            </Column>
          )}
        </div>
        {!!paging && filteredItems && filteredItems.length > 10 && (
          <Paging paging={paging} isLoading={isLoading} goToPage={goToPage} />
        )}
      </Panel>
    )
  }
}

export default PanelSearch
