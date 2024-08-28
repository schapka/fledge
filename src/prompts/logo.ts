import { EOL } from 'os';

export async function showLogo(duration = 350) {
  const logo = [
    '',
    ' @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                       ',
    '   @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                     ',
    '     @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                   ',
    '       @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                 ',
    '         @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                               ',
    '           @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                             ',
    '             @@@@@@@@@@@@@@@@@@@@@@@@@@                                                            ',
    '              @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                          ',
    '                @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                        ',
    '                  @@@@@@@@@@@@@@@@@@@@@@@@@@@                                                      ',
    '                    @@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '                  @@@@@@@@@@@@@@@@@@@@@@@@@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '                @@@@@@@@@@@@@@@@@@@@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '              @@@@@@@@@@@@@@@@@@@@@@@@@@@        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '            @@@@@@@@@@@@@@@@@@@@@@@@@@@          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '          @@@@@@@@@@@@@@@@@@@@@@@@@@@            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '        @@@@@@@@@@@@@@@@@@@@@@@@@@@              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '      @@@@@@@@@@@@@@@@@@@@@@@@@@@                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '     @@@@@@@@@@@@@@@@@@@@@@@@@@                  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '   @@@@@@@@@@@@@@@@@@@@@@@@@@@                   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    ' @@@@@@@@@@@@@@@@@@@@@@@@@@@                     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ',
    '                                                                                                   ',
    ' @@@@@@@@@@@@   @@@@           @@@@@@@@@@@@@   @@@@@@@@@@@@          @@@@@@@@@@@     @@@@@@@@@@@@@ ',
    ' @@@@@@@@@@@@   @@@@           @@@@@@@@@@@@@   @@@@@@@@@@@@@@      @@@@@@@@@@@@@     @@@@@@@@@@@@@ ',
    ' @@@@@          @@@@           @@@@@           @@@@@     @@@@@    @@@@@@             @@@@          ',
    ' @@@@@          @@@@           @@@@@           @@@@@      @@@@@   @@@@               @@@@          ',
    ' @@@@@@@@@@@    @@@@           @@@@@@@@@@@@    @@@@@       @@@@  @@@@@    @@@@@@@    @@@@@@@@@@@@  ',
    ' @@@@@@@@@@@    @@@@           @@@@@@@@@@@@    @@@@@       @@@@  @@@@@    @@@@@@@    @@@@@@@@@@@@  ',
    ' @@@@@          @@@@           @@@@@           @@@@@      @@@@@   @@@@@      @@@@    @@@@          ',
    ' @@@@@          @@@@@          @@@@@           @@@@@@@@@@@@@@@     @@@@@@@@@@@@@@    @@@@          ',
    ' @@@@@          @@@@@@@@@@@@   @@@@@@@@@@@@@@  @@@@@@@@@@@@@        @@@@@@@@@@@@@    @@@@@@@@@@@@@ ',
    ' @@@@           @@@@@@@@@@@@    @@@@@@@@@@@@@  @@@@@@@@@@@@            @@@@@@@       @@@@@@@@@@@@@ ',
    '',
  ].join(EOL);
  process.stdout.write(logo);
  await new Promise((resolve) => setTimeout(resolve, duration));
}
